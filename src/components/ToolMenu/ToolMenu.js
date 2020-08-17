import React from 'react';
import PropTypes from 'prop-types';
import { Build, Code } from '@material-ui/icons';
import { useLocation } from 'react-router-dom';
import URI from 'urijs';
import DropDownMenuButton from '../DropDownMenuButton';

const ToolMenu = ({
  intl, mapUtility, navigator,
}) => {
  const location = useLocation();

  // Open embedderView
  const openEmbedder = () => {
    if (!navigator || !mapUtility) {
      return;
    }
    const pathname = location.pathname.split('/');
    pathname.splice(2, 0, 'embedder');

    const uri = URI(window.location);
    const search = uri.search(true);
    if (!search.bbox) {
      search.bbox = mapUtility.getBbox();
    }
    uri.search(search);

    const newLocation = {
      ...location,
      pathname: pathname.join('/'),
      search: uri.search(),
    };

    navigator.push(newLocation);
  };

  const menuItems = [
    {
      key: 'embedder.title',
      text: intl.formatMessage({ id: 'embedder.title' }),
      icon: <Code />,
      onClick: () => {
        openEmbedder();
      },
      srText: intl.formatMessage({ id: 'general.open' }),
    },
  ];

  return (
    <>
      <DropDownMenuButton
        buttonIcon={<Build />}
        buttonText={intl.formatMessage({ id: 'general.tools' })}
        menuItems={menuItems}
      />
    </>
  );
};

ToolMenu.propTypes = {
  classes: PropTypes.shape({
    menuContainer: PropTypes.string,
  }).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  mapUtility: PropTypes.shape({
    getBbox: PropTypes.func,
  }),
  navigator: PropTypes.shape({
    push: PropTypes.func,
  }),
};

ToolMenu.defaultProps = {
  mapUtility: null,
  navigator: null,
};

export default ToolMenu;
