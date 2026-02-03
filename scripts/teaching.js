function renderTeachingItems(courses) {
    const container = document.getElementById('teaching-list');

    const termOrder = { Spring: 1, Summer: 1.5, Autumn: 2, Fall: 2, Monsoon: 2, Winter: 3 };

    const getSession = (text) => {
        const m = text.match(/\b(Spring|Summer|Autumn|Fall|Winter|Monsoon)\s*(?:[-/])?\s*(\d{4})\b/i);
        if (!m) return 'Other';
        const termRaw = m[1];
        const year = m[2];
        const term = termRaw.charAt(0).toUpperCase() + termRaw.slice(1).toLowerCase();
        return `${term} ${year}`;
    };

    const sessionKey = (session) => {
        const [term, year] = session.split(' ');
        const ord = termOrder[term] ?? -1;
        return `${year}-${String(ord).padStart(2, '0')}`;
    };

    const stripSession = (text) => {
        const re = new RegExp(
            String.raw`(?:[,;\s\-–—]*)\b(?:Spring|Summer|Autumn|Fall|Winter|Monsoon)\s*(?:[-/])?\s*\d{4}\b\s*\.?\s*$`,
            'i'
        );
        return text.replace(re, '').replace(/\s*[,:;\-–—]+\s*$/, '').trim();
    };

    const grouped = {};
    courses.forEach(({ course_name }) => {
        const session = getSession(course_name);
        grouped[session] = grouped[session] || [];
        grouped[session].push(stripSession(course_name));
    });

    const sessions = Object.keys(grouped).sort((a, b) => sessionKey(b).localeCompare(sessionKey(a)));

    let html = '';
    sessions.forEach((session, index) => {
        const sessionId = `teaching-session-${index}`;
        const isFirst = index === 0; // First (most recent) session open by default
        const courseCount = grouped[session].length;
        
        if (session !== 'Other') {
            html += `
                <div class="teaching-dropdown ${isFirst ? 'is-open' : ''}">
                    <button class="teaching-dropdown-header" onclick="toggleTeachingDropdown('${sessionId}')" aria-expanded="${isFirst}" aria-controls="${sessionId}">
                        <span class="dropdown-icon">
                            <i class="fas fa-chevron-right"></i>
                        </span>
                        <span class="session-title">${session}</span>
                        <span class="course-count">${courseCount} course${courseCount !== 1 ? 's' : ''}</span>
                    </button>
                    <div class="teaching-dropdown-content" id="${sessionId}" ${isFirst ? 'style="max-height: 1000px;"' : ''}>
                        <div class="teaching-list">
            `;
        } else {
            html += '<div class="teaching-list">';
        }
        
        grouped[session].forEach((name) => {
            html += `
                <div class="teaching-item">
                    <span class="bullet">•</span>
                    <span class="course-name">${name}</span>
                </div>
            `;
        });
        
        if (session !== 'Other') {
            html += `
                        </div>
                    </div>
                </div>
            `;
        } else {
            html += '</div>';
        }
    });

    container.innerHTML = html;
}

// Toggle dropdown function
function toggleTeachingDropdown(sessionId) {
    const content = document.getElementById(sessionId);
    const dropdown = content.closest('.teaching-dropdown');
    const header = dropdown.querySelector('.teaching-dropdown-header');
    const isOpen = dropdown.classList.contains('is-open');
    
    if (isOpen) {
        content.style.maxHeight = '0';
        dropdown.classList.remove('is-open');
        header.setAttribute('aria-expanded', 'false');
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        dropdown.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
    }
}

async function fetchTeaching() {
    const { data, error } = await supabaseClient
        .from('teaching')
        .select('course_name');
    if (error) return;
    renderTeachingItems(data);
}

document.addEventListener('DOMContentLoaded', fetchTeaching);