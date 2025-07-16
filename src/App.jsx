import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Home from "@/components/pages/Home";
import Clubs from "@/components/pages/Clubs";
import Books from "@/components/pages/Books";
import Lists from "@/components/pages/Lists";
import Profile from "@/components/pages/Profile";
import ClubDetail from "@/components/pages/ClubDetail";
import BookDetail from "@/components/pages/BookDetail";
import DiscussionDetail from "@/components/pages/DiscussionDetail";
import Quizzes from "@/components/pages/Quizzes";
import QuizDetail from "@/components/pages/QuizDetail";
import CreateClub from "@/components/pages/CreateClub";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";

function App() {
  return (
<div className="min-h-screen bg-background">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="clubs/create" element={<CreateClub />} />
          <Route path="clubs/:id" element={<ClubDetail />} />
          <Route path="books" element={<Books />} />
          <Route path="books/:id" element={<BookDetail />} />
          <Route path="lists" element={<Lists />} />
          <Route path="profile" element={<Profile />} />
          <Route path="discussions/:id" element={<DiscussionDetail />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="quiz/:id" element={<QuizDetail />} />
        </Route>
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="!bg-surface !text-primary"
        bodyClassName="!font-sans"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;