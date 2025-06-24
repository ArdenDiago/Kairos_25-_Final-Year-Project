import { useState } from "react";
import { Routes, Route } from 'react-router-dom';

import TeamLogin from "./app/team-login/page.tsx";
import Test from './app/test/page.tsx';
import TestCompleted from './app/test-completed/page.tsx';

import HostLogin from "./app/host-login/page.tsx";
import HostDashboard from "./app/host/dashboard/page.tsx";

export default function ItManagerPage() {
  const [submitStatus, setSubmitStatus] = useState(true);
  const [compleatedStatus, setCompleatedStatus] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  const changeSubmiFlag = () => {
    setSubmitStatus((pre) => !pre);
  };

  const changeCompleatFlag = () => {
    setCompleatedStatus((pre) => !pre);
  };

  const changeAdminFlag = () => {
    setAdmin((pre) => !pre);
  };

  return (
    <Routes>
      {/* Route for /admin */}
      <Route path="/admin/*" element={
        <>
          {!isAdmin ? (
            <HostLogin onAdmin={changeAdminFlag} />
          ) : (
            <HostDashboard />
          )}
        </>
      } />

      <Route path="/Dashboard" element={<HostDashboard />} />

      {/* Route for / */}
      <Route
        path=""
        element={
          <>
            {!compleatedStatus ? (
              submitStatus ? (
                <TeamLogin onSubmitButton={changeSubmiFlag} />
              ) : (
                <Test onCompleat={changeCompleatFlag} />
              )
            ) : (
              <TestCompleted />
            )}
          </>
        }
      />
    </Routes>
  );
}
