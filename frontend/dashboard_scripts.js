document.addEventListener('DOMContentLoaded', () => {
    const requestButtons = document.querySelectorAll('.request-access-btn');

    requestButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const examItem = e.target.closest('.exam-item');
            const examId = examItem.dataset.examId;
            const examTitle = examItem.querySelector('h4').textContent;
            
            // In a real application, you'd send a request to your backend here
            // Example: fetch('/api/request-access', { method: 'POST', body: { examId, studentId } });
            
            alert(`Permission requested for "${examTitle}". Please wait for admin approval.`);
            e.target.textContent = 'Requested';
            e.target.disabled = true;

            // Simulating admin approval after a delay
            setTimeout(() => {
                const isApproved = confirm(`Admin has approved your request for "${examTitle}". Click OK to start the exam.`);
                if (isApproved) {
                    // Redirect to the exam page with the exam ID
                    window.location.href = `exam.html?examId=${examId}`;
                }
            }, 5000);
        });
    });
});