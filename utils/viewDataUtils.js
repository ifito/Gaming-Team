const { platformMap } = require('../constans');

exports.getPlatformViewData = (selectedPlatform) => {
    const platform = Object.keys(platformMap).map(key => ({
        value: key,
        label: platformMap[key],
        isSelected: selectedPlatform == key,
    }));

    return platform;
}