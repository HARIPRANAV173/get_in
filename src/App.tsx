import LoginPage from "./components/auth/LoginPage";
import StudentDashboard from "./components/dashboards/StudentDashboard";
import TeacherDashboard from "./components/dashboards/TeacherDashboard";
import ParentDashboard from "./components/dashboards/ParentDashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AttendanceProvider } from "./contexts/AttendanceContext";
import { DatabaseProvider } from "./contexts/DatabaseContext";

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "student":
        return <StudentDashboard />;
      case "teacher":
        return <TeacherDashboard />;
      case "parent":
        return <ParentDashboard />;
      default:
        return <LoginPage />;
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderDashboard()}</div>;
}

function App() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <AttendanceProvider>
          <AppContent />
        </AttendanceProvider>
      </AuthProvider>
    </DatabaseProvider> 
  );
}

export default App;
