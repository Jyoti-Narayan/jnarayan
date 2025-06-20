// Initialize Supabase client
const studentsClient = window.supabaseClient;

// Function to create a student card
function createStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'student-item';

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

// Function to load and display students
async function loadStudents() {
    try {
        const { data: students, error } = await studentsClient
            .from('students')
            .select('*')
            .eq('status', 'present')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Clear existing content
        document.getElementById('masters-grid').innerHTML = '';
        document.getElementById('bachelors-grid').innerHTML = '';
        document.getElementById('intern-grid').innerHTML = '';

        // Group students by degree
        const groupedStudents = students.reduce((acc, student) => {
            if (!acc[student.degree]) {
                acc[student.degree] = [];
            }
            acc[student.degree].push(student);
            return acc;
        }, {});

        // Display Masters students
        if (groupedStudents.Masters) {
            groupedStudents.Masters.forEach(student => {
                document.getElementById('masters-grid').appendChild(createStudentCard(student));
            });
        }

        // Display Bachelors students
        if (groupedStudents.Bachelors) {
            groupedStudents.Bachelors.forEach(student => {
                document.getElementById('bachelors-grid').appendChild(createStudentCard(student));
            });
        }

        // Display Intern students
        if (groupedStudents.Intern) {
            groupedStudents.Intern.forEach(student => {
                document.getElementById('intern-grid').appendChild(createStudentCard(student));
            });
        }

    } catch (error) {
        console.error('Error loading students:', error);
    }
}

// Load students when the page loads
document.addEventListener('DOMContentLoaded', loadStudents); 