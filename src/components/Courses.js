import React, { useState, useEffect } from 'react';
import { academicsAPI } from '../services/api';
import '../styles/Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const [availableRes, myCoursesRes] = await Promise.all([
        academicsAPI.getCourses(),
        academicsAPI.getMyCourses()
      ]);
      setCourses(availableRes.data.courses);
      setMyCourses(myCoursesRes.data.courses);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await academicsAPI.enrollCourse(courseId);
      alert('Enrolled successfully');
      fetchCourses();
    } catch (err) {
      alert('Enrollment failed');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="courses-container">
      <h1>Courses</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'available' ? 'active' : ''} 
          onClick={() => setActiveTab('available')}
        >
          Available Courses
        </button>
        <button 
          className={activeTab === 'enrolled' ? 'active' : ''} 
          onClick={() => setActiveTab('enrolled')}
        >
          My Courses
        </button>
      </div>

      {activeTab === 'available' && (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.course_code}</h3>
              <p>{course.course_name}</p>
              <p>Credits: {course.credits}</p>
              <button onClick={() => handleEnroll(course.id)}>Enroll</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'enrolled' && (
        <div className="courses-grid">
          {myCourses.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.course_code}</h3>
              <p>{course.course_name}</p>
              <p>Credits: {course.credits}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;