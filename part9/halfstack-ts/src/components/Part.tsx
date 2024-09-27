import React from 'react'

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CourtPartBaseDescription extends CoursePartBase{
  description: string;
}

interface CoursePartBasic extends CourtPartBaseDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CourtPartBaseDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CourtPartBaseDescription {
  requirements: string[];
  kind: 'special'
}

export type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

export default function Part({ part }: { part: CoursePart }) {

  /**
   * Helper function for exhaustive type checking
   */
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch (part.kind) {
    case 'basic':
      return (
        <div>
          <div className='text-xl font-bold'>
            {part.name} {part.exerciseCount}
          </div>
          <div className='italic'>
            {part.description}
          </div>
        </div>
      )
    case 'background':
      return (
        <div>
          <div className='text-xl font-bold'>
            {part.name} {part.exerciseCount}
          </div>
          <div className='italic'>
            {part.description}
          </div>
          <div>
            {part.backgroundMaterial}
          </div>
        </div>
      )
    case 'group':
      return (
        <div>
          <div className='text-xl font-bold'>
            {part.name} {part.exerciseCount}
          </div>
          <div>
            project exercises {part.groupProjectCount}
          </div>
        </div>
      )
    case 'special':
      return (
        <div>
          <div className='text-xl font-bold'>
            {part.name} {part.exerciseCount}
          </div>
          <div className='italic'>
            {part.description}
          </div>
          <div>
            required skills: {part.requirements.join(', ')}
          </div>
        </div>
      )
    default:
      return assertNever(part)
  }
}
