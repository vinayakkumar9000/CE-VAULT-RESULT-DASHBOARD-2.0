import mongoose, { Schema, Document } from 'mongoose';

/**
 * Subject schema for student results
 */
export interface ISubject {
  code: string;
  name: string;
  marks: number;
  credits: number;
}

/**
 * Student document interface
 */
export interface IStudent extends Document {
  rollNumber: string;
  name: string;
  semester: number;
  branch: string;
  subjects: ISubject[];
  sgpa: number;
  cgpa?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Student schema
 */
const SubjectSchema = new Schema<ISubject>({
  code: { type: String, required: true },
  name: { type: String, required: true },
  marks: { type: Number, required: true, min: 0, max: 100 },
  credits: { type: Number, required: true, min: 0 },
});

const StudentSchema = new Schema<IStudent>(
  {
    rollNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    subjects: {
      type: [SubjectSchema],
      required: true,
      default: [],
    },
    sgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient queries
StudentSchema.index({ rollNumber: 1 });
StudentSchema.index({ name: 'text' });
StudentSchema.index({ semester: 1, branch: 1 });

// Export the model
const Student =
  mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
