// Get the index of the tab based on given param
const getTabIndex = (tab) => {
  switch (tab) {
    case `appointments`:
      return 0;
    case `payments`:
      return 1;
    case `notes`:
      return 2;
    case `procedures`:
      return 3;
    case `documents`:
      return 4;
    default:
      return 0;
  }
};

export default getTabIndex;
