import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Build, Code } from '@material-ui/icons';
import { useLocation } from 'react-router-dom';
import { intlShape } from 'react-intl';
import PaperButton from '../PaperButton';
import SimpleListItem from '../ListItems/SimpleListItem';

const ToolMenu = ({
  classes, intl, navigator,
}) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Open embedderView
  const openEmbedder = () => {
    if (!navigator) {
      return;
    }
    const pathname = location.pathname.split('/');
    pathname.splice(2, 0, 'embedder');
    const newLocation = {
      ...location,
      pathname: pathname.join('/'),
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

  const renderMenu = () => {
    if (!open) {
      return null;
    }

    return (
      <div className={classes.menuContainer}>
        {
          menuItems.map(v => (
            <SimpleListItem
              key={v.key}
              icon={v.icon}
              button
              handleItemClick={v.onClick}
              srText={v.srText}
              text={v.text}
            />
          ))
        }
      </div>
    );
  };

  return (
    <>
      <PaperButton
        messageID="general.tools"
        icon={<Build />}
        noBorder
        onClick={() => {
          setOpen(!open);
        }}
      />
      {
        renderMenu()
      }
    </>
  );
};

ToolMenu.propTypes = {
  classes: PropTypes.shape({
    menuContainer: PropTypes.string,
  }).isRequired,
  intl: intlShape.isRequired,
  navigator: PropTypes.shape({
    push: PropTypes.func,
  }),
};

ToolMenu.defaultProps = {
  navigator: null,
};

export default ToolMenu;
