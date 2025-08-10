function renderTeachingItems(courses) {
    const container = document.getElementById('teaching-list');

    const termOrder = { Spring: 1, Summer: 1.5, Autumn: 2, Fall: 2, Monsoon: 2, Winter: 3 };
    // role classification removed per requirement

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
        // Remove trailing session markers like ", Spring 2025" or "- Autumn-2025" with optional period and spaces
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
    sessions.forEach((session) => {
        if (session !== 'Other') {
            html += `<div class="teaching-session">${session}</div>`;
        }
        html += '<div class="teaching-list">';
        grouped[session].forEach((name) => {
            html += `
                <div class="teaching-item">
                    <span class="bullet">•</span>
                    <span class="course-name">${name}</span>
                </div>
            `;
        });
        html += '</div>';
    });

    container.innerHTML = html;
}

async function fetchTeaching() {
    const { data, error } = await supabaseClient
        .from('teaching')
        .select('course_name');
    if (error) return;
    renderTeachingItems(data);
}

document.addEventListener('DOMContentLoaded', fetchTeaching);