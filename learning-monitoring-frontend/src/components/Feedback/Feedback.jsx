import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { getData, postData } from '../../services/axios';
import { UserContext } from '../../contexts/UserContext/UserContext';
import { Button } from 'primereact';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './Feedback.css';
import { validateEmptyString } from '../../validations/client-validation'
import { Toast } from 'primereact/toast';

const Feedback = ({ trainig_student, feedbackData = [] }) => {
  const toast = useRef(null);
  const { user } = useContext(UserContext);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [editingFeedback, setEditingFeedback] = useState(null);

  const fetchFeedbacks = useCallback(async () => {
    try {
      if (!feedbackData.length || feedbackList != []) {
        const condition = `trainig_student_id=${trainig_student.id}`;
        feedbackData = await getData('feedback/read', { condition: condition })
        feedbackData = feedbackData.data;
      }
      const writers = await getData('user/read');
      feedbackData = feedbackData.map(feedback => (typeof feedback.writer_id == 'number' ? { ...feedback, writer_id: writers.data.find(writer => writer.id == feedback.writer_id)?.name } : feedback))
      setFeedbackList(feedbackData);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  }, [trainig_student.id]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleAddFeedback = async () => {
    try {
      if (user.role !== 'מנטור' && user.role !== 'מנהל') {
        console.error('Only mentors and managers can add feedback');
        return;
      }
      const validate = validateEmptyString(feedbackText);
      if (validate != '') {
        toast.current.show({ severity: 'error', summary: 'שגיאה', detail: validate })
      }
      else {
        if (editingFeedback) {
          await postData('feedback/update', {
            id: editingFeedback.id,
            feedback: feedbackText,
            writer_id: user.id,
            training_student_id: editingFeedback.training_student_id,
            date: new Date(),
          });
        }
        else {
          await postData('feedback/create', {
            feedback: feedbackText,
            writer_id: user.id,
            trainig_student_id: trainig_student.id,
            date: new Date()
          });
        }
        setFeedbackText('');
        setEditingFeedback(null);
        fetchFeedbacks();
      }

    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  const handleEditFeedback = (feedback) => {
    setFeedbackText(feedback.feedback);
    setEditingFeedback(feedback);
  };

  const handleDeleteFeedback = async (id) => {
    try {
      await postData('feedback/delete', { id });
      fetchFeedbacks();
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className='display-feedbacks'>

        {(user.role === 'מנטור' || user.role === 'מנהל') && (
          <div className="feedback-input-container">
            <input
              type="text"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="הכנס פידבק"
              className="feedback-input"
            />
            <Button label="שמירה" severity="secondary" text raised className="feedback-save-button" onClick={handleAddFeedback} />
          </div>
        )}
        <div className="feedbacks">
          {feedbackList.length > 0 ? (
            feedbackList.map((item) => (
              <div key={item.id} className="feedback-item">
                <div className="feedback-actions">
                  {(user.role === 'מנטור' || user.role === 'מנהל') && user.name === item.writer_id && (
                    <>
                      <Button
                        icon="pi pi-trash"
                        onClick={() => handleDeleteFeedback(item.id)}
                        className="feedback-action-button"
                      />
                      <Button
                        icon="pi pi-pencil"
                        onClick={() => handleEditFeedback(item)}
                        className="feedback-action-button"
                      />
                    </>
                  )}
                </div>
                <div className="feedback-text">
                {item.feedback} <div className="writer-info">נכתב ע&rdquo;י: {item.writer_id}</div>
                </div>
              </div>
            ))
          ) : (
            <div>לא נמצאו פידבקים</div>
          )
          }
        </div >

      </div>
    </>
  );
};

export default Feedback;