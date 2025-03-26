import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumbs, activeItem } from 'store/reducers/menu';

/**
 * Hook to manage breadcrumbs from within components
 * 
 * @param {Array} breadcrumbs - Array of breadcrumb objects with format { title, url, id }
 * @param {boolean} updateActiveItem - Whether to also update the active menu item (defaults to true)
 */
const useBreadcrumbs = (breadcrumbs, updateActiveItem = true) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Set breadcrumbs in redux store
    dispatch(setBreadcrumbs({ breadcrumbs }));
    
    // Update active menu item if requested and if we have breadcrumbs with IDs
    if (updateActiveItem && breadcrumbs.length > 0 && breadcrumbs[0].id) {
      dispatch(activeItem({ openItem: [breadcrumbs[0].id] }));
    }
    
    return () => {
      dispatch(setBreadcrumbs({ breadcrumbs: [] }));
    };

  }, [dispatch, breadcrumbs, updateActiveItem]);
};

export default useBreadcrumbs; 