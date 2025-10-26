import React, { useState, useEffect } from 'react';
import { academicsAPI } from '../services/api';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import Alert from './ui/Alert';
import '../styles/Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enrolled');
  const [enrolling, setEnrolling] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

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
      setError('Failed to load courses. Please try again.');
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    setEnrolling(courseId);
    setError('');
    setSuccessMessage('');
    
    try {
      await academicsAPI.enrollCourse(courseId);
      setSuccessMessage('Successfully enrolled in course!');
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.error || 'Enrollment failed. Please try again.');
    } finally {
      setEnrolling(null);
    }
  };

  if (loading) {
    return (
      <div className="courses-loading">
        <Spinner size="lg" text="Loading courses..." />
      </div>
    );
  }

  return (
    <div className="courses-container">
      {/* Header */}
      <div className="courses-header">
        <div>
          <h1 className="courses-title">My Courses</h1>
          <p className="courses-subtitle">
            Manage your enrolled courses and discover new ones
          </p>
        </div>
        <div className="courses-stats">
          <div className="stat-item">
            <span className="stat-value">{myCourses.length}</span>
            <span className="stat-label">Enrolled</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{courses.length}</span>
            <span className="stat-label">Available</span>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <div className="courses-tabs">
        <button
          className={`tab-button ${activeTab === 'enrolled' ? 'active' : ''}`}
          onClick={() => setActiveTab('enrolled')}
        >
          <span className="tab-icon">📚</span>
          My Courses ({myCourses.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          <span className="tab-icon">🔍</span>
          Available Courses ({courses.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="courses-content">
        {activeTab === 'enrolled' && (
          <div className="courses-grid">
            {myCourses.length === 0 ? (
              <Card className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No Enrolled Courses</h3>
                <p>You haven't enrolled in any courses yet. Browse available courses to get started!</p>
                <Button variant="primary" onClick={() => setActiveTab('available')}>
                  Browse Courses
                </Button>
              </Card>
            ) : (
              myCourses.map(course => (
                <Card key={course.id} hoverable className="course-card enrolled-course">
                  <div className="course-header">
                    <div className="course-icon">📖</div>
                    <div className="course-badge enrolled">Enrolled</div>
                  </div>
                  <h3 className="course-code">{course.course_code}</h3>
                  <h4 className="course-name">{course.course_name}</h4>
                  <div className="course-footer">
                    <div className="course-credits">
                      <span className="credit-icon">⭐</span>
                      <span>{course.credits} Credits</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details →
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'available' && (
          <div className="courses-grid">
            {courses.length === 0 ? (
              <Card className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No Available Courses</h3>
                <p>There are no courses available for enrollment at the moment.</p>
              </Card>
            ) : (
              courses.map(course => (
                <Card key={course.id} hoverable className="course-card">
                  <div className="course-header">
                    <div className="course-icon">📘</div>
                    <div className="course-badge available">Available</div>
                  </div>
                  <h3 className="course-code">{course.course_code}</h3>
                  <h4 className="course-name">{course.course_name}</h4>
                  <div className="course-footer">
                    <div className="course-credits">
                      <span className="credit-icon">⭐</span>
                      <span>{course.credits} Credits</span>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleEnroll(course.id)}
                      isLoading={enrolling === course.id}
                    >
                      {enrolling === course.id ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;