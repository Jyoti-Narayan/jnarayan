// Initialize Supabase client
const studentsClient = window.supabaseClient;

// Function to create a student card
function createStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'student-item';

    const imageSection = document.createElement('div');
    imageSection.className = 'student-image-wrapper';

    if (student.image_url) {
        imageSection.innerHTML = `<img src="${student.image_url}" alt="${student.name}" class="student-image">`;
    } else {
        imageSection.innerHTML = `<div class="student-placeholder"><i class="fas fa-user-graduate"></i></div>`;
    }

    card.appendChild(imageSection);

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
        card.appendChild(statusBadge);
    }

    if (student.joint_supervisor) {
        const supervisorSection = document.createElement('div');
        supervisorSection.className = 'student-supervisor';
        supervisorSection.innerHTML = `
            <i class="fas fa-user-tie"></i>
            <span>Joint Supervisor: ${student.joint_supervisor}</span>
        `;
        card.appendChild(supervisorSection);
    }

    card.appendChild(nameSection);
    card.appendChild(yearSection);
    card.appendChild(thesisSection);

    return card;
}

// Function to load and display students sorted by year
async function loadStudents() {
    try {
        // Fetch ALL students regardless of status, sorted by year (descending - newest first)
        const { data: students, error } = await studentsClient
            .from('students')
            .select('*')
            .order('year', { ascending: false, nullsFirst: false });

        if (error) throw error;

        // Clear existing content
        const doctoralGrid = document.getElementById('doctoral-grid');
        const mastersGrid = document.getElementById('masters-grid');
        const bachelorsGrid = document.getElementById('bachelors-grid');
        const internGrid = document.getElementById('intern-grid');

        if (doctoralGrid) doctoralGrid.innerHTML = '';
        if (mastersGrid) mastersGrid.innerHTML = '';
        if (bachelorsGrid) bachelorsGrid.innerHTML = '';
        if (internGrid) internGrid.innerHTML = '';

        // Group students by degree
        const groupedStudents = students.reduce((acc, student) => {
            if (!acc[student.degree]) {
                acc[student.degree] = [];
            }
            acc[student.degree].push(student);
            return acc;
        }, {});

        // Display Doctoral students
        if (groupedStudents.Doctoral && doctoralGrid) {
            groupedStudents.Doctoral.forEach(student => {
                doctoralGrid.appendChild(createStudentCard(student));
            });
        }

        // Display Masters students
        if (groupedStudents.Masters && mastersGrid) {
            groupedStudents.Masters.forEach(student => {
                mastersGrid.appendChild(createStudentCard(student));
            });
        }

        // Display Bachelors students
        if (groupedStudents.Bachelors && bachelorsGrid) {
            groupedStudents.Bachelors.forEach(student => {
                bachelorsGrid.appendChild(createStudentCard(student));
            });
        }

        // Display Intern students
        if (groupedStudents.Intern && internGrid) {
            groupedStudents.Intern.forEach(student => {
                internGrid.appendChild(createStudentCard(student));
            });
        }

    } catch (error) {
        console.error('Error loading students:', error);
    }
}

// Load students when the page loads
document.addEventListener('DOMContentLoaded', loadStudents);