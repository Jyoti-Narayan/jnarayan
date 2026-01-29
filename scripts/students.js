// Initialize Supabase client
const studentsClient = window.supabaseClient;

// Function to create a student card
function createStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'student-item';

    const imageSection = document.createElement('div');
    imageSection.className = 'student-image-wrapper';

    if (student.image_url) {
        const imageUrl = window.convertGoogleDriveUrl ? window.convertGoogleDriveUrl(student.image_url) : student.image_url;
        imageSection.innerHTML = `<img src="${imageUrl}" alt="${student.name}" class="student-image">`;
    } else {
        imageSection.innerHTML = `<div class="student-placeholder"><i class="fas fa-user-graduate"></i></div>`;
    }

    card.appendChild(imageSection);

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'student-content-wrapper';

    const nameSection = document.createElement('div');
    nameSection.className = 'student-info';
    nameSection.innerHTML = `
        <i class="fas fa-user"></i>
        ${student.url ?
            `<a href="${student.url}" class="student-name">${student.name}</a>` :
            `<span class="student-name">${student.name}</span>`
        }
    `;

    const yearSection = document.createElement('div');
    yearSection.className = 'student-year';
    yearSection.innerHTML = `
        <i class="fas fa-calendar"></i>
        <span>${student.year || 'Present'}</span>
    `;

    const thesisSection = document.createElement('div');
    thesisSection.className = 'student-thesis';
    thesisSection.innerHTML = `
        <i class="fas fa-book"></i>
        <span>${student.thesis_title || 'Project in progress'}</span>
    `;

    // Add status badge for past students
    if (student.status === 'past') {
        const statusBadge = document.createElement('div');
        statusBadge.className = 'student-status alumni';
        statusBadge.innerHTML = `<span class="badge">Alumni</span>`;
        contentWrapper.appendChild(statusBadge);
    }

    if (student.joint_supervisor) {
        const supervisorSection = document.createElement('div');
        supervisorSection.className = 'student-supervisor';
        supervisorSection.innerHTML = `
            <i class="fas fa-user-tie"></i>
            <span>Joint Supervisor: ${student.joint_supervisor}</span>
        `;
        contentWrapper.appendChild(supervisorSection);
    }

    contentWrapper.appendChild(nameSection);
    contentWrapper.appendChild(yearSection);
    contentWrapper.appendChild(thesisSection);

    card.appendChild(imageSection);
    card.appendChild(contentWrapper);

    return card;
}

// Function to load and display students sorted by year
async function loadStudents() {
    try {
        const { data: students, error } = await studentsClient
            .from('students')
            .select('*')
            .order('year', { ascending: false, nullsFirst: false });

        if (error) throw error;

        // Helper to render a category
        const renderCategory = (containerId, categoryStudents) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            container.innerHTML = '';
            // Remove the main grid class because we will nest grids inside
            container.classList.remove('students-grid');
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '2rem';

            const present = categoryStudents.filter(s => s.status !== 'past');
            const past = categoryStudents.filter(s => s.status === 'past');

            if (present.length > 0) {
                // If we have mixed past/present, label this group. Otherwise just show them.
                if (past.length > 0) {
                    const title = document.createElement('h5');
                    title.className = 'student-category-label';
                    title.innerText = 'Current Members';
                    container.appendChild(title);
                }

                const grid = document.createElement('div');
                grid.className = 'students-grid';
                present.forEach(student => grid.appendChild(createStudentCard(student)));
                container.appendChild(grid);
            }

            if (past.length > 0) {
                const title = document.createElement('h5');
                title.className = 'student-category-label';
                title.innerText = 'Alumni';
                container.appendChild(title);

                const grid = document.createElement('div');
                grid.className = 'students-grid';
                past.forEach(student => grid.appendChild(createStudentCard(student)));
                container.appendChild(grid);
            }
        };

        // Group students by degree
        const groupedStudents = students.reduce((acc, student) => {
            if (!acc[student.degree]) {
                acc[student.degree] = [];
            }
            acc[student.degree].push(student);
            return acc;
        }, {});

        // Render each category
        if (groupedStudents.Doctoral) renderCategory('doctoral-grid', groupedStudents.Doctoral);
        if (groupedStudents.Masters) renderCategory('masters-grid', groupedStudents.Masters);
        if (groupedStudents.Bachelors) renderCategory('bachelors-grid', groupedStudents.Bachelors);
        if (groupedStudents.Intern) renderCategory('intern-grid', groupedStudents.Intern);

    } catch (error) {
        console.error('Error loading students:', error);
    }
}

// Load students when the page loads
document.addEventListener('DOMContentLoaded', loadStudents);