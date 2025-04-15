// Wait for document to be fully loaded
$(document).ready(function() {
    console.log('DOM fully loaded and jQuery is working');
    
    // Tab navigation functionality
    $('#main-nav .nav-link').on('click', function(e) {
        e.preventDefault();
        console.log('Tab clicked:', $(this).data('tab'));
        
        // Remove active class from all links and tabs
        $('#main-nav .nav-link').removeClass('active');
        $('.tab-content').removeClass('active');
        
        // Add active class to clicked link and corresponding tab
        $(this).addClass('active');
        const tabId = $(this).data('tab');
        $('#' + tabId).addClass('active');
    });
    
    // Message filtering functionality
    $('#filter-button').on('click', function() {
        console.log('Filter button clicked');
        const message = $('#message-input').val().trim();
        
        if (message) {
            const filterResult = $('#filter-result');
            const filterMessage = $('#filter-message');
            const filterAlert = $('#filter-alert');
            const filterExplanation = $('#filter-explanation');
            
            filterMessage.text(message);
            filterResult.removeClass('d-none safe low-risk high-risk');
            filterAlert.removeClass('alert-success alert-warning alert-danger');
            
            // Simple filtering logic
            const lowRiskWords = ['custom', 'private', 'special', 'request', 'personal'];
            const highRiskWords = ['meet', 'hotel', 'address', 'location', 'phone', 'number', 'extra'];
            
            let riskLevel = 'safe';
            if (lowRiskWords.some(word => message.toLowerCase().includes(word))) {
                riskLevel = 'low-risk';
            }
            if (highRiskWords.some(word => message.toLowerCase().includes(word))) {
                riskLevel = 'high-risk';
            }
            
            console.log('Message risk level:', riskLevel);
            filterResult.addClass(riskLevel);
            
            if (riskLevel === 'safe') {
                filterAlert.addClass('alert-success');
                filterExplanation.text('This message is safe and can be automatically responded to.');
            } else if (riskLevel === 'low-risk') {
                filterAlert.addClass('alert-warning');
                filterExplanation.text('This message has been flagged as low-risk. Review recommended before responding.');
            } else {
                filterAlert.addClass('alert-danger');
                filterExplanation.text('This message has been flagged for review due to potential safety concerns.');
            }
            
            filterResult.removeClass('d-none');
        }
    });
    
    // Response style customization
    function updateResponsePreview() {
        console.log('Updating response preview');
        const flirtiness = parseInt($('#flirtiness').val());
        const friendliness = parseInt($('#friendliness').val());
        const formality = parseInt($('#formality').val());
        
        $('#flirtiness-value').text(flirtiness);
        $('#friendliness-value').text(friendliness);
        $('#formality-value').text(formality);
        
        let response = '';
        
        if (flirtiness >= 7 && friendliness >= 6) {
            response = 'Aww you\'re so sweet! 💕 I love knowing you enjoy my content... stay tuned for more soon! 😘';
        } else if (flirtiness >= 5 && friendliness >= 5) {
            response = 'Thanks so much! 😊 I\'m really happy you\'re enjoying my content!';
        } else if (formality >= 7) {
            response = 'Thank you for your support! I appreciate your feedback on my content.';
        } else {
            response = 'Thanks! Glad you\'re enjoying the content.';
        }
        
        $('#response-preview').text(response);
    }
    
    $('.style-slider').on('input', updateResponsePreview);
    
    // Preset styles
    $('.preset-button').on('click', function() {
        console.log('Preset button clicked:', $(this).data('preset'));
        $('.preset-button').removeClass('active');
        $(this).addClass('active');
        
        const preset = $(this).data('preset');
        if (preset === 'professional') {
            $('#flirtiness').val(3);
            $('#friendliness').val(7);
            $('#formality').val(8);
        } else if (preset === 'casual') {
            $('#flirtiness').val(5);
            $('#friendliness').val(7);
            $('#formality').val(4);
        } else if (preset === 'flirty') {
            $('#flirtiness').val(8);
            $('#friendliness').val(7);
            $('#formality').val(3);
        }
        
        updateResponsePreview();
    });
    
    console.log('All event listeners attached');
});
