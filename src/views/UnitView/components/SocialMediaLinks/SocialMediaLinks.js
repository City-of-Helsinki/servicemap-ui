import styled from '@emotion/styled';
import DefaultIcon from '@mui/icons-material/Public';
import { Divider, List, ListItem, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { getIcon } from '../../../../components';
import useLocaleText from '../../../../utils/useLocaleText';
import unitSectionFilter from '../../utils/unitSectionFilter';

const SocialMediaLinks = ({ unit }) => {
  const getLocaleText = useLocaleText();
  const links = unitSectionFilter(unit.connections, 'SOCIAL_MEDIA_LINK');
  const columns = 3;

  if (links.length) {
    return (
      <SomeListContainer>
        <SomeTitle><FormattedMessage id="unit.socialMedia.title" /></SomeTitle>
        <SomeList>
          {links.map((link, i) => (
            <React.Fragment key={link.id}>
              <SomeItem
                disableGutters
                button
                role="link"
                component="li"
                onClick={() => link.value.www && window.open(getLocaleText(link.value.www))}
              >
                {getIcon(getLocaleText(link.value.name).toLowerCase())
                  || <StyledDefaultIcon />
                }
                <StyledItemText>
                  {getLocaleText(link.value.name)}
                </StyledItemText>
              </SomeItem>
              {(i + 1 === links.length || (i + 1) % columns === 0)
                ? null : ( // Dont draw divider if last of list or last of row
                  <VerticalDividerContainer aria-hidden>
                    <VerticalDivider />
                  </VerticalDividerContainer>
                )
              }
            </React.Fragment>
          ))}
        </SomeList>
        <SomeDivider aria-hidden />
      </SomeListContainer>
    );
  } return null;
};

const VerticalDividerContainer = styled(ListItem)(() => ({
  width: '12%',
  justifyContent: 'center',
}));

const VerticalDivider = styled.span(() => ({
  backgroundColor: '#2242C7',
  width: 1,
  height: 25,
}));

const SomeListContainer = styled.div(({ theme }) => ({
  padding: theme.spacing(1),
  paddingTop: theme.spacing(2),
  paddingLeft: 72,
}));

const SomeTitle = styled(Typography)(() => ({
  textAlign: 'start',
}));

const StyledItemText = styled(Typography)(() => ({
  color: '#2242C7',
  fontSize: '0.875rem',
}));

const SomeItem = styled(ListItem)(({ theme }) => ({
  width: '25%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(0.5),
  justifyContent: 'center',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: '#fff',
  },
  '&:active': {
    backgroundColor: '#fff',
  },
}));

const StyledDefaultIcon = styled(DefaultIcon)(() => ({
  height: 25,
  width: 25,
  color: '#2242C7',
}));

const SomeList = styled(List)(() => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
}));

const SomeDivider = styled(Divider)(({ theme }) => ({
  marginRight: -theme.spacing(3),
}));

SocialMediaLinks.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

SocialMediaLinks.defaultProps = {
};

export default SocialMediaLinks;
