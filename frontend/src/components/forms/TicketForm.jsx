import React, { useState } from 'react';
import { TICKET_CATEGORIES } from '../../utils/constants';
import { FilePlus, Wrench } from 'lucide-react';

export const TicketForm = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!title.trim()) {
      setError('A descriptive title is required');
      return false;
    }
    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters long');
      return false;
    }
    if (!category) {
      setError('Please select a category type');
      return false;
    }
    if (!description.trim()) {
      setError('A description of the complaint is required');
      return false;
    }
    if (description.trim().length < 10) {
      setError('Description must be at least 10 characters long to help diagnostics');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ title, category, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left text-zinc-200">
      {error && (
        <div className="bg-rose-950/20 border border-rose-900/30 text-rose-450 p-3.5 rounded-xl text-xs font-semibold animate-shake">
          {error}
        </div>
      )}

      {/* Ticket Title */}
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="ticket-title" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Issue Title
        </label>
        <input
          id="ticket-title"
          type="text"
          placeholder="e.g. Broken corridor light bulb, main flush leaking"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="input-field"
          required
        />
      </div>

      {/* Category Dropdown */}
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="ticket-category" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Category Type
        </label>
        <select
          id="ticket-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isSubmitting}
          className="input-field bg-zinc-950 text-zinc-200 appearance-none"
          required
        >
          <option value="" disabled>-- Choose a category --</option>
          {TICKET_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Ticket Description */}
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="ticket-desc" className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Detailed Description
        </label>
        <textarea
          id="ticket-desc"
          rows="4"
          placeholder="Please provide details about the location of the issue and how it can be accessed..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          className="input-field resize-none"
          required
        ></textarea>
      </div>

      {/* Form Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/35">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="btn-secondary py-2.5 px-4 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary py-2.5 px-5 text-xs font-semibold cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Filing ticket...</span>
            </>
          ) : (
            <>
              <FilePlus className="w-4 h-4" />
              <span>Raise Ticket</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TicketForm;
