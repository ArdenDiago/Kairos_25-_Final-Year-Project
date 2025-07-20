const http = require('http');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const listEndpoints = require('express-list-endpoints');
const { domainName, portNo } = require('./utils/environmentalVariables');
require("dotenv").config();

// Routers
const homePageDetails = require(path.join(__dirname, "Routs_Model", "General_Routs", "generalRouter"));
const userDefinedRouts = require(path.join(__dirname, "Routs_Model", "UserDefinedRouts", "userRouts"));
const razorpayRouter = require('./Routs_Model/Payment/payment.router');
const coordinatorRouter = require('./Routs_Model/coordinator/coordinator.router');
const facultyCoordinatorRouter = require('./Routs_Model/facultyRouts/faculty.router');
const events = require('./Routs_Model/Events/Events.router');

// Authentication logic 
const { initializeAuth, setupAuthRoutes, checkIfCoordinator, checkIfTeacherCoordinator } = require("./Authentication_Files/auth");
const { startAllProcesses } = require('./utils/startUpPrograms');

// Setup of WebSocket Server
const { initializeSocket } = require('./Routs_Model/PhotoBooth/socket');

// Initialize Express App
const app = express();
const PORT_NO = portNo;

// ✅ Function to Start the Server AFTER startAllProcesses()
async function startServer() {
    try {
        console.log("🔄 Running startAllProcesses...");
        await startAllProcesses();  // ✅ Ensure this completes before server starts
        console.log("✅ startAllProcesses completed successfully!");

        // Serve static files
        app.use(express.static(path.join(__dirname, 'public')));


        // Middleware to remove `/api` prefix from URLs
        app.use((req, res, next) => {
            if (req.url.startsWith('/api/')) {
                req.url = req.url.replace('/api', ''); // ✅ Removes only `/api`, keeps the rest
            }
            next();
        });
         app.use((req, res, next) => {
            if (req.url.startsWith('/undefined/')) {
                req.url = req.url.replace('/undefined', ''); // ✅ Removes only `/api`, keeps the rest
            }
            next();
        });

        // Initialize authentication middleware
        initializeAuth(app);

        // Set up authentication routes
        setupAuthRoutes(app);

        // Create server
        const server = http.createServer(app);

        // Setup WebSocket Server
        initializeSocket(server);
        console.log("✅ WebSocket Server is set up!");


        // CORS
        const corsOptions = {
            origin: domainName || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        };
        app.use(cors(corsOptions));

        // Chalk for Color Coding the logs
        (async () => {
            global.chalk = await import('chalk').then(m => m.default);
            console.log(chalk.green('Chalk is working!'));
        })();

        // Morgan Logger
        app.use(morgan((tokens, req, res) => {
            const status = tokens.status(req, res);
            const statusCategory = status >= 400
                ? chalk.bgRed.white.bold(' FAILURE ')
                : chalk.bgGreen.black.bold(' SUCCESS ');

            return [
                statusCategory,
                chalk.blue.bold(tokens.method(req, res)),
                chalk.yellow(tokens.url(req, res)),
                chalk.magenta(`Status: ${status}`),
                chalk.cyan(`Response Time: ${tokens['response-time'](req, res)} ms`),
                chalk.gray(`IP: ${tokens['remote-addr'](req, res)}`),
                chalk.white(`User-Agent: ${tokens['user-agent'](req, res)}`)
            ].join(' | ');
        }));

        // Middleware
        app.use(helmet());
        app.use(express.json());

        // Routes
        app.use('/', homePageDetails);
        app.use('/userRout', userDefinedRouts);
        app.use('/payment', razorpayRouter);
        app.use('/event', events);
        app.use('/coordinator', checkIfCoordinator, coordinatorRouter);
        app.use('/faculty', checkIfTeacherCoordinator, facultyCoordinatorRouter)

        // ✅ Endpoint to View All Routes
        app.get('/routes', (req, res) => {
            res.json(listEndpoints(app));
        });

        // Set up static file serving
        // ✅ Catch-all handler to support client-side routing (e.g., React Router)
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        // Start Server after `startAllProcesses()` completes
        server.listen(PORT_NO, () => console.log(`🚀 Server is running on http://localhost:${PORT_NO} & Node Env ${process.env.NODE_ENV}`));

    } catch (error) {
        console.error("❌ Error in startAllProcesses:", error);
        process.exit(1);  // Stop execution if `startAllProcesses()` fails
    }
}

// Start the Server
startServer();

module.exports = app;
