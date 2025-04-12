(function initializeCategories() {
    const hardcoded = [
        { name: "Ocean", description: "Waterfronts, waves, and sea serenity." },
        { name: "Sunset", description: "Colorful skies and golden hour shots." }
    ];

    const stored = JSON.parse(localStorage.getItem("categories")) || [];
    const existingNames = stored.map(c => c.name);

    // Add hardcoded only if not already present
    hardcoded.forEach(h => {
        if (!existingNames.includes(h.name)) {
            stored.push(h);
        }
    });

    localStorage.setItem("categories", JSON.stringify(stored));
})();
