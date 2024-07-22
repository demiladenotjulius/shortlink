chrome.action.onClicked.addListener(() => {
    console.log('Extension icon clicked');  // Debugging statement
    const websiteUrl = 'https://shortlink-puce.vercel.app';
  
    chrome.tabs.create({ url: websiteUrl }, (tab) => {
      console.log('New tab created:', tab);  // Debugging statement
    });
  });
  