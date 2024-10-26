'use server';

import { redirect } from 'next/navigation';
import { saveMeal } from './meals';

// creates server action that guarantee to execute on server
// when form submitted, next.js create request to next.js server so this function get triggers and handle form submissio
export async function shareMeal(formData) {
  // get by the "name" of the form
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  };

  await saveMeal(meal);
  redirect('/meals');
}
