import { Route, Routes } from "react-router-dom";
import SiteLayout from "./components/layout/site-layout";
import { NotFound } from "./components/data-boundary";
import HomePage from "./pages/home";
import CoursesPage, { CoursePage } from "./pages/courses";
import SummariesPage, { ReaderPage } from "./pages/responsi";
import SchedulePage, { EventPage } from "./pages/study-clubs";
import VideosPage from "./pages/videos";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:courseId" element={<CoursePage />} />
        <Route path="responsi" element={<SummariesPage />} />
        <Route path="responsi/:summaryId" element={<ReaderPage />} />
        <Route path="study-clubs" element={<SchedulePage />} />
        <Route path="study-clubs/:eventId" element={<EventPage />} />
        <Route path="videos" element={<VideosPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
