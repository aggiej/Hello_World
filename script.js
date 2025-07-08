document.addEventListener('DOMContentLoaded', () => {
    const journalSection = document.getElementById('journal');
    const milestonesSection = document.getElementById('milestones');
    const mainNavUl = document.querySelector('#main-nav ul'); // Updated selector

    let allJournalData = []; // To store all entries after fetching
    let uniqueMonths = []; // To store unique months for navigation

    async function fetchData() {
        try {
            const response = await fetch('data/journal_entries.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allJournalData = await response.json();
            // Sort entries by monthId descending (most recent first)
            allJournalData.sort((a, b) => b.monthId.localeCompare(a.monthId));

            // Populate uniqueMonths for navigation
            const monthSet = new Set();
            allJournalData.forEach(entry => monthSet.add(JSON.stringify({month: entry.month, monthId: entry.monthId})));
            uniqueMonths = Array.from(monthSet).map(item => JSON.parse(item));
            // uniqueMonths is already sorted by virtue of allJournalData being sorted
            // and Set preserving insertion order for non-primitive types (effectively).

            return allJournalData;
        } catch (error) {
            console.error("Could not fetch journal data:", error);
            journalSection.innerHTML = '<p>Error loading journal entries. Please try again later.</p>';
            return []; // Return empty array on error
        }
    }

    function displayJournalEntries(entriesToDisplay) {
        const journalHeading = journalSection.querySelector('h2');
        journalSection.innerHTML = '';
        if (journalHeading) {
            journalSection.appendChild(journalHeading);
        }

        if (!entriesToDisplay || entriesToDisplay.length === 0) {
            const noEntriesMessage = document.createElement('p');
            noEntriesMessage.textContent = "No journal entries available for this period.";
            journalSection.appendChild(noEntriesMessage);
            return;
        }

        entriesToDisplay.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('journal-entry');
            entryDiv.setAttribute('id', `entry-${entry.monthId}`); // For direct linking if needed

            const monthTitle = document.createElement('h3');
            monthTitle.textContent = `${entry.month}: ${entry.title}`;
            entryDiv.appendChild(monthTitle);

            const contentP = document.createElement('p');
            contentP.innerHTML = entry.content; // Use innerHTML if content might have basic HTML
            entryDiv.appendChild(contentP);

            if (entry.pictures && entry.pictures.length > 0) {
                const picturesDiv = document.createElement('div');
                picturesDiv.classList.add('pictures-container'); // For better styling
                entry.pictures.forEach(picUrl => {
                    const img = document.createElement('img');
                    // Assuming pictures are in 'data/images/' relative to 'data/journal_entries.json'
                    // So, if picUrl is "images/placeholder_jan_1.jpg", the path is "data/images/placeholder_jan_1.jpg"
                    img.src = `data/${picUrl}`;
                    img.alt = `${entry.title} picture`;
                    picturesDiv.appendChild(img);
                });
                entryDiv.appendChild(picturesDiv);
            }
            journalSection.appendChild(entryDiv);
        });
    }

    function displayMilestones(entriesToDisplay) {
        const milestonesHeading = milestonesSection.querySelector('h2');
        milestonesSection.innerHTML = '';
        if (milestonesHeading) {
            milestonesSection.appendChild(milestonesHeading);
        }

        const milestonesList = document.createElement('ul');
        milestonesList.classList.add('milestones-list');

        let hasMilestones = false;
        entriesToDisplay.forEach(entry => {
            if (entry.milestones && entry.milestones.length > 0) {
                hasMilestones = true;
                const monthMilestoneHeader = document.createElement('h4');
                monthMilestoneHeader.textContent = entry.month;
                milestonesList.appendChild(monthMilestoneHeader);

                const monthSpecificList = document.createElement('ul');
                entry.milestones.forEach(milestone => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('milestone');
                    listItem.textContent = milestone;
                    monthSpecificList.appendChild(listItem);
                });
                milestonesList.appendChild(monthSpecificList);
            }
        });

        if (!hasMilestones) {
            const noMilestonesMessage = document.createElement('p');
            noMilestonesMessage.textContent = "No milestones recorded for this period.";
            milestonesList.appendChild(noMilestonesMessage);
        }
        milestonesSection.appendChild(milestonesList);
    }

    async function initializePage() {
        const data = await fetchData();
        if (data.length > 0) {
            populateMonthNavigation(); // Populate nav first
            displayJournalEntries(data); // Display all entries by default initially
            displayMilestones(data);     // Display all milestones by default

            // Add event listener for "All Entries" link
            const allEntriesLink = document.getElementById('all-entries-link');
            if (allEntriesLink) {
                allEntriesLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    displayJournalEntries(allJournalData);
                    displayMilestones(allJournalData);
                    setActiveNavLink(allEntriesLink.parentElement); // Pass the LI element
                });
            }
        } else {
            // Display messages if no data is loaded
            if (journalSection.children.length <=1) { // Check if only heading is present
                 const noEntriesMessage = document.createElement('p');
                 noEntriesMessage.textContent = "No journal entries found.";
                 journalSection.appendChild(noEntriesMessage);
            }
            if (milestonesSection.children.length <=1) {
                const noMilestonesMessage = document.createElement('p');
                noMilestonesMessage.textContent = "No milestones found.";
                milestonesSection.appendChild(noMilestonesMessage);
            }
        }
    }

    function populateMonthNavigation() {
        if (!mainNavUl) return;

        // The "All Entries" link is already in HTML, we start adding after it.
        // Or, clear existing month links if this function could be called multiple times (though not current design)
        // Example: mainNavUl.innerHTML = '<li><a href="#" id="all-entries-link">All Entries</a></li>';


        uniqueMonths.forEach(monthObj => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${monthObj.monthId}`;
            link.textContent = monthObj.month;
            link.setAttribute('data-monthid', monthObj.monthId);

            link.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedMonthId = e.target.getAttribute('data-monthid');
                const filteredEntries = allJournalData.filter(entry => entry.monthId === selectedMonthId);
                displayJournalEntries(filteredEntries);
                displayMilestones(filteredEntries); // Show milestones for the selected month
                setActiveNavLink(e.target.parentElement); // Pass the LI element
            });

            listItem.appendChild(link);
            mainNavUl.appendChild(listItem);
        });
    }

    function setActiveNavLink(activeLiElement) {
        // Remove 'active' class from all nav links
        const navLinks = mainNavUl.querySelectorAll('li');
        navLinks.forEach(li => li.classList.remove('active-nav-link'));
        // Add 'active' class to the clicked link's parent LI
        if (activeLiElement) {
            activeLiElement.classList.add('active-nav-link');
        }
    }

    // Initialize the page
    if (journalSection && milestonesSection && mainNavUl) {
        initializePage();
    } else {
        console.error("Essential HTML elements (journal, milestones, or main navigation UL) not found.");
    }
});
