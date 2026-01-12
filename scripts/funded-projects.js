// Funded Projects Module - Fetches and renders funded projects table

async function fetchFundedProjects() {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await window.supabaseClient
            .from('funded_projects')
            .select('*')
            .order('order_index', { ascending: true })
            .order('status', { ascending: true });

        if (error) {
            console.error('Error fetching funded projects:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching funded projects:', error);
        return [];
    }
}

function formatDuration(project) {
    if (project.duration) {
        return project.duration;
    }

    if (project.start_date && project.end_date) {
        const start = new Date(project.start_date).getFullYear();
        const end = new Date(project.end_date).getFullYear();
        return `${start} - ${end}`;
    }

    if (project.start_date) {
        const start = new Date(project.start_date).getFullYear();
        return `${start} - Present`;
    }

    return 'N/A';
}

function formatAgencyAmount(project) {
    let result = project.agency || 'N/A';
    if (project.amount) {
        result += ` / ${project.amount}`;
    }
    return result;
}

function getStatusBadgeClass(status) {
    switch (status?.toLowerCase()) {
        case 'ongoing':
            return 'status-ongoing';
        case 'completed':
            return 'status-completed';
        case 'submitted':
            return 'status-submitted';
        default:
            return 'status-default';
    }
}

function renderFundedProjects(projects) {
    const container = document.getElementById('funded-projects-table');
    if (!container) {
        console.error('Funded projects table container not found');
        return;
    }

    if (!projects || projects.length === 0) {
        container.innerHTML = `
            <div class="notification is-info is-light">
                <p class="has-text-centered">Project details coming soon.</p>
            </div>
        `;
        return;
    }

    const html = `
        <div class="table-responsive">
            <table class="funded-projects-table">
                <thead>
                    <tr>
                        <th class="col-title">Title</th>
                        <th class="col-agency">Agency / Amount</th>
                        <th class="col-type">Type</th>
                        <th class="col-status">Status / Duration</th>
                    </tr>
                </thead>
                <tbody>
                    ${projects.map(project => `
                        <tr class="project-row ${getStatusBadgeClass(project.status)}">
                            <td class="project-title">
                                ${project.title}
                                ${project.description ? `<p class="project-description">${project.description}</p>` : ''}
                            </td>
                            <td class="project-agency">${formatAgencyAmount(project)}</td>
                            <td class="project-type">
                                <span class="type-badge type-${project.project_type?.toLowerCase() || 'sponsored'}">${project.project_type || 'Sponsored'}</span>
                            </td>
                            <td class="project-status">
                                <span class="status-badge ${getStatusBadgeClass(project.status)}">${project.status || 'Ongoing'}</span>
                                <span class="project-duration">${formatDuration(project)}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}

// Initialize funded projects when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Wait for Supabase to be ready
        await new Promise(resolve => setTimeout(resolve, 700));

        const projects = await fetchFundedProjects();
        renderFundedProjects(projects);
    } catch (error) {
        console.error('Error initializing funded projects:', error);
    }
});

// Export functions
window.fetchFundedProjects = fetchFundedProjects;
window.renderFundedProjects = renderFundedProjects;
