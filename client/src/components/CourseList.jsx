import React, { useState, useEffect } from 'react';
import api from '../api';

import CourseCard from './CourseCard';
import CharacterPicker from './CharacterPicker';

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

  return (
    <div>
      <h2>Courses</h2>
      <CharacterPicker characters={pickerItems} />
    </div>
  );
};

export default CourseList;
