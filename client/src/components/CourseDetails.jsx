import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useSession} from '../contexts/SessionContext';

const CourseList = () => {
  const [course, setCourse] = useState({});

  const [showDelegates, setShowDelegates] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(`/api/courses/${id}`);
        console.log(response.data);
        setCourse(response.data.course);
      } catch (error) {
        console.error(`Failed to fetch course with id ${id}`, error);
      }
    };

    fetchCourses();

  }, []);

  const toggleDelegates = () => {
    setShowDelegates(!showDelegates);
  }

const { user } = useSession();

const handleEnroll = () => {
  console.log('User Clicked Enroll');

  if (!user) {
    console.error('User is not logged in');
    return;
  }

  const enrollCourses = async () => {
    try {
      const response = await api.post('/api/courses/enroll', { users: [user.id], courseId: course.id });
      setCourse(response.data.course);
    } catch (error) {
      console.error(`Failed to enroll in course with id ${id}`, error);
    }
  };

  enrollCourses();
};

async function logUserEnrolledCourses(userId) {
  try {

    const res = await api.get(`/api/users/${userId}`);
    const userData = res.data;
    const possibleCourses = userData.courses || userData.enrolledCourses || userData.courses_enrolled || userData.userCourses || null;
    if (Array.isArray(possibleCourses)) {
      console.log('Enrolled courses (from user endpoint):', possibleCourses);
      return possibleCourses;
    }
  } catch (error) {
    console.error(`Failed to fetch enrolled courses for user with id ${userId}`, error);
    return [];
  }

}

 function testLogEnrolled() {

  
    console.log('Current user from session:', user);
    if (user) {
      logUserEnrolledCourses(user.id);
    }
 }

  return (
    <div>
      <h2>Course Details {course.id}ID</h2>
      {course.id && (
        <>
        <div className="card">
          <div>Course Number: {course.id}</div>
          <div>Course Title: {course.title}</div>
          <div>Course Description: {course.description}</div>
          <div>Course Category: {course.category.category_name}</div>
          <div>Students Enrolled: {course.users?.length}</div>
          <div className="card-options">
            <button className="button" onClick={() => toggleDelegates()}>View Delegates</button>
            <button className="button" onClick={() => handleEnroll()}>Enroll</button>
            <button className="test" onClick={() => testLogEnrolled()}>Test Log Enrolled Courses</button>
          </div>
        </div>

        {showDelegates && (

          <div className="card mt-5">
            <h3>Delegates</h3>
            <div className="delegate-list">
              {course.users.map((user) => (
                <div key={user.id} className="delegate">
                  <div>{user.username}</div>
                  <div>{user.email}</div>
                </div>
              ))}
            </div>
          </div> )
        }
      </>   
      )}
    </div>
  );
};

export default CourseList;
