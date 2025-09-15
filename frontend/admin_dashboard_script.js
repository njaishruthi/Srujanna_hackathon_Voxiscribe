document.addEventListener('DOMContentLoaded', () => {
    const createExamBtn = document.getElementById('create-exam-btn');
    const viewScriptBtns = document.querySelectorAll('.view-script-btn');
    const checkPlagiarismBtns = document.querySelectorAll('.check-plagiarism-btn');

    // Handle "Create Exam" button click
    createExamBtn.addEventListener('click', () => {
        // Redirect to the exam creation page
        window.location.href = 'admin_dashboard_create_exam.html';
    });

    // Handle "View" script button clicks
    viewScriptBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            const scriptId = e.target.dataset.scriptId;
            // In a real application, you would make an API call to view the script
            alert(`Viewing script with ID: ${scriptId}`);
            // You can also redirect to a view page: window.location.href = `view_script.html?id=${scriptId}`;
        });
    });

    // Handle "Check Plagiarism" button clicks
    checkPlagiarismBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            const scriptId = e.target.dataset.scriptId;
            // In a real application, you would make an API call to check plagiarism
            alert(`Checking plagiarism for script with ID: ${scriptId}`);
        });
    });
});