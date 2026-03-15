import React, { useState, useEffect } from 'react';
import api from '../api';

import CourseCard from './CourseCard';
import CharacterPicker from './CharacterPicker';
import { useSession } from '../contexts/SessionContext';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses');

        console.log('courses', response.data);

        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };

    fetchCourses();
  }, []);

  // map courses into the character format CharacterPicker expects
  const pickerItems = courses.map((character, i) => ({
    id: character.id,
    name: character.title,
    image: `https://via.placeholder.com/150?text=Course+${character.id}`, 
    description: character.description,
    color: `hsl(${(i * 55) % 360} 70% 60%)`,
  }))

  const { user } = useSession();

  const handleEnroll = async (courseId) => {
    if (!user?.id) {
      console.error('User not logged in');
      return;
    }

    // check if user is enrolled in any other course
    const enrolledCourse = courses.find((c) => c.users && c.users.some((u) => u.id === user.id));
    if (enrolledCourse) {
      console.log('user on class');
    }

    try {
      // enroll the user in the selected course via API
      await api.post('/api/users/enroll', { courseId });

      // optimistic local update: remove user from previous course and add to new
      setCourses((prev) =>
        prev.map((c) => {
          if (enrolledCourse && c.id === enrolledCourse.id) {
            return { ...c, users: c.users.filter((u) => u.id !== user.id) };
          }
          if (c.id === courseId) {
            return { ...c, users: [...(c.users || []), user] };
          }
          return c;
        })
      );
    } catch (error) {
      console.error('Failed to change enrollment', error);
    }
  };

  return (
    <div>
      <h2>Courses</h2>
      <CharacterPicker characters={pickerItems} onEnroll={handleEnroll} />
      
    </div>
  );
};

export default CourseList;
