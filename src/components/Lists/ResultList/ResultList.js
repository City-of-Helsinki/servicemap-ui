/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  List, Typography, Divider,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import styled from '@emotion/styled';
import UnitItem from '../../ListItems/UnitItem';
import ServiceItem from '../../ListItems/ServiceItem';
import AddressItem from '../../ListItems/AddressItem';
import EventItem from '../../ListItems/EventItem';

class ResultList extends React.Component {
  // Update only when data changes
  shouldComponentUpdate(nextProps) {
    const { data, title } = this.props;
    return (data !== nextProps.data) || (title !== nextProps.title);
  }

  render() {
    const {
      beforeList = null,
      data,
      customComponent = null,
      listId,
      resultCount = null,
      title = null,
      titleComponent,
      embeddedList = false,
    } = this.props;

    return (
      <StyledContainer data-sm="ResultListRoot">
        {
          title
          && (
            <StyledTitleRoot>
              <StyledTitleContainer>
                <StyledTitle
                  id={`${listId}-result-title`}
                  className="SearchResultTitle"
                  component={titleComponent}
                  variant="subtitle1"
                  aria-labelledby={`${listId}-result-title ${listId}-result-title-info`}
                  tabIndex={-1}
                >
                  {title}

                </StyledTitle>
                <StyledTitleInfo
                  id={`${listId}-result-title-info`}
                  component="p"
                  variant="caption"
                  aria-hidden="true"
                >
                  <FormattedMessage id="search.resultList" values={{ count: resultCount || data.length }} />
                </StyledTitleInfo>
              </StyledTitleContainer>
            </StyledTitleRoot>
          )
        }
        {!embeddedList ? <Divider aria-hidden="true" /> : null}
        {beforeList}
        <StyledList id={listId}>
          {
            data && data.length
            && data.map((item) => {
              const { id, object_type } = item;
              let itemComponent = null;
              switch (object_type) {
                case 'unit':
                  itemComponent = <UnitItem simpleItem={embeddedList} key={`unit-${id}`} className={`unit-${id}`} unit={item} />;
                  break;
                case 'service':
                  itemComponent = <ServiceItem key={`service-${id}`} service={item} />;
                  break;
                case 'address':
                  itemComponent = <AddressItem key={`address-${item.municipality.id}-${item.name.fi}`} address={item} />;
                  break;
                case 'event':
                  itemComponent = <EventItem key={`event-${id}`} event={item} />;
                  break;
                default:
                  if (customComponent && item) {
                    itemComponent = customComponent(item);
                  }
              }

              if (item) {
                return itemComponent;
              }
              return null;
            })
          }
        </StyledList>
      </StyledContainer>
    );
  }
}

const StyledContainer = styled('div')(() => ({
  height: 'auto',
  overflowY: 'auto',
  flex: '1 1 auto',
  maxWidth: '100%',
  overflowX: 'hidden',
}));

const StyledTitleRoot = styled('div')(() => ({
  width: '100%',
  display: 'flex',
}));

const StyledTitleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  overflow: 'hidden',
  padding: theme.spacing(1, 2),
}));

const StyledList = styled(List)(() => ({
  maxHeight: '100%',
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  textTransform: 'uppercase',
  fontWeight: 'bold',
  textAlign: 'left',
  float: 'left',
  margin: theme.spacing(1),
}));

const StyledTitleInfo = styled(Typography)(({ theme }) => ({
  float: 'right',
  margin: theme.spacing(1),
  whiteSpace: 'nowrap',
}));

export default ResultList;

// Typechecking
ResultList.propTypes = {
  beforeList: PropTypes.node,
  customComponent: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  listId: PropTypes.string.isRequired,
  resultCount: PropTypes.number,
  title: PropTypes.string,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
  embeddedList: PropTypes.bool,
};
