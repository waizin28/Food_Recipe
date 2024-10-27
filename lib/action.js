'use server';

import { redirect } from 'next/navigation';
import { saveMeal } from './meals';
import { revalidatePath } from 'next/cache';

function isInvalidText(text) {
  return !text || text.trim() === '';
}

// creates server action that guarantee to execute on server
// when form submitted, next.js create request to next.js server so this function get triggers and handle form submissio
export async function shareMeal(prevState, formData) {
  // get by the "name" of the form
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return {
      message: 'Inavlid input.',
    };
  }

  await saveMeal(meal);

  // revalidate cache that belong to certain route path's only page
  // revalidate -> 'layout' certain route path and its nested route
  revalidatePath('/meals');
  redirect('/meals');
}
