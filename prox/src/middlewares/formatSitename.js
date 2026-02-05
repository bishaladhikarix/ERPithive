

const formatSitename = (req, res, next) => {
    const hostHeader = req.headers.host;
    const siteName = req.body.site_name; 
    console.log("Host header:", hostHeader);
    console.log("Site name parameter:", siteName);

    if (!hostHeader || !siteName) {
        return res.status(400).json({ message: "Host header and site name are required." });
    }

    const formattedSiteName = `${siteName}.${hostHeader}`;
    req.formattedSiteName = formattedSiteName;
    console.log("Formatted site name:", formattedSiteName);
    next();
};

export default formatSitename;