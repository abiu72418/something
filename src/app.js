const fetchData = async (cik) => {
    const response = await fetch(`https://data.sec.gov/api/xbrl/companyconcept/CIK${cik}/dei/EntityCommonStockSharesOutstanding.json`, {
        headers: { 'User-Agent': 'YourAppName/1.0' }
    });
    const data = await response.json();
    return data;
};

const processSharesData = (data) => {
    const entityName = data.entityName;
    const shares = data.units.shares.filter(entry => entry.fy > '2020' && !isNaN(entry.val));
    const max = shares.reduce((prev, current) => (prev.val > current.val) ? prev : current);
    const min = shares.reduce((prev, current) => (prev.val < current.val) ? prev : current);
    return { entityName, max, min };
};

const updateDOM = (entityName, max, min) => {
    document.title = entityName;
    document.getElementById('share-entity-name').innerText = entityName;
    document.getElementById('share-max-value').innerText = max.val;
    document.getElementById('share-max-fy').innerText = max.fy;
    document.getElementById('share-min-value').innerText = min.val;
    document.getElementById('share-min-fy').innerText = min.fy;
};

const init = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cik = urlParams.get('CIK') || '0000004904';
    const data = await fetchData(cik);
    const processedData = processSharesData(data);
    updateDOM(processedData.entityName, processedData.max, processedData.min);
};

init();
