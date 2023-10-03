document.addEventListener('DOMContentLoaded', function() {
    // Load masking terms from CSV file
    fetch('assets/data/masking_terms.csv')
        .then(response => response.text())
        .then(data => {
            const maskingTerms = data.split('\n').filter(term => term.trim() !== '');

            // Load secured keywords from another CSV file
            fetch('assets/data/secured_keywords.csv')
                .then(response => response.text())
                .then(keywordsData => {
                    const securedKeywords = keywordsData.split('\n').filter(keyword => keyword.trim() !== '');

                    // Apply forward masking to product titles and descriptions
                    const productTitles = document.querySelectorAll('.product-title');
                    const productDescriptions = document.querySelectorAll('.product-description');

                    productTitles.forEach(title => {
                        applyMasking(title, maskingTerms, securedKeywords);
                    });

                    productDescriptions.forEach(description => {
                        applyMasking(description, maskingTerms, securedKeywords);
                    });
                });
        });

    // Function to apply the masking effect, considering secured keywords
    function applyMasking(element, maskingTerms, securedKeywords) {
        const originalText = element.textContent;
        const originalWords = originalText.split(/\s+/); // Split text into words

        // Replace non-essential words or words not in securedKeywords with masking terms
        const maskedWords = originalWords.map(word => {
            if (!securedKeywords.includes(word.toLowerCase())) {
                const matchingTerms = maskingTerms.filter(term => term.length === word.length);
                const maskingTerm = matchingTerms[Math.floor(Math.random() * matchingTerms.length)];
                return maskingTerm || word; // Use the original word if no masking term of the same length
            }
            return word; // Keep secured keywords unchanged
        });

        element.textContent = maskedWords.join(' '); // Rejoin words with spaces
        setTimeout(() => {
            element.textContent = originalText;
        }, 50); // Adjust the duration (in milliseconds) as needed
    }
});
