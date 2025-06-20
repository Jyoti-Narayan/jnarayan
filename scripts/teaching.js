// Function to render teaching items
function renderTeachingItems(courses) {
    const container = document.getElementById('teaching-list');
    
    let html = '<div class="teaching-list">';
    courses.forEach(course => {
        html += `
            <div class="teaching-item">
                <span class="bullet">•</span>
                <span class="course-name">${course.course_name}</span>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

// Fetch and render teaching
async function fetchTeaching() {
    const { data, error } = await supabaseClient
        .from('teaching')
        .select('course_name')
        .order('course_name');
    
    if (error) {
        console.error('Error fetching teaching:', error);
        return;
    }
    
    renderTeachingItems(data);
}

// Initialize teaching section
document.addEventListener('DOMContentLoaded', fetchTeaching); 