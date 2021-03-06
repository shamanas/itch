import * as React from "react";
import { createStructuredSelector } from "reselect";
import { connect } from "./connect";
import * as classNames from "classnames";

import { IRootState, ITabData } from "../types";

import { dispatcher } from "../constants/action-types";
import * as actions from "../actions";

import { FiltersContainer, filtersContainerHeight } from "./filters-container";
import IconButton from "./basics/icon-button";

import env from "../env";

import styled, * as styles from "./styles";

import format from "./format";
import { Space } from "../helpers/space";

const TitleFiltersContainer = styled(FiltersContainer)`
  max-height: ${filtersContainerHeight}px;
`;

const DraggableDiv = styled.div`
  -webkit-app-region: drag;
  flex: 1 1;
  display: flex;
  align-self: stretch;

  &.dimmed {
    opacity: 0.2;
  }
`;

const DraggableDivInner = styled.div`
  flex: 1 1;
  display: flex;
  align-self: center;
  align-items: center;
`;

const Filler = styled.div`flex: 1 1;`;

const TitleDiv = styled.div`
  ${styles.singleLine()};

  font-size: ${props => props.theme.fontSizes.large};
`;

const emptyObj = {};

export class TitleBar extends React.PureComponent<IProps & IDerivedProps> {
  render() {
    const { tab, maximized, focused, tabData, inner = null } = this.props;

    const sp = Space.fromData(tabData);
    let label = sp.label();

    const loggedIn = tab !== "login";
    if (!loggedIn) {
      label = env.appName;
    }

    return (
      <TitleFiltersContainer className="title-bar">
        <DraggableDiv className={classNames({ dimmed: !focused })}>
          <DraggableDivInner>
            <TitleDiv className="title-bar-text">{format(label)}</TitleDiv>
            {inner}
            <Filler />
          </DraggableDivInner>
        </DraggableDiv>
        {loggedIn ? (
          <IconButton
            id="preferences-top-button"
            icon="cog"
            onClick={this.preferencesClick}
          />
        ) : null}
        <IconButton icon="minus" onClick={this.minimizeClick} />
        <IconButton
          icon={maximized ? "window-restore" : "window-maximize"}
          onClick={this.maximizeRestoreClick}
        />
        <IconButton icon="remove" onClick={this.closeClick} />
      </TitleFiltersContainer>
    );
  }

  preferencesClick = () => {
    this.props.navigate({ tab: "preferences" });
  };

  minimizeClick = () => {
    this.props.minimizeWindow({});
  };

  maximizeRestoreClick = () => {
    this.props.toggleMaximizeWindow({});
  };

  closeClick = () => {
    this.props.hideWindow({});
  };
}

interface IProps {
  tab: string;
  inner?: JSX.Element | JSX.Element[];
}

interface IDerivedProps {
  tabData: ITabData;
  maximized: boolean;
  focused: boolean;

  navigate: typeof actions.navigate;
  hideWindow: typeof actions.hideWindow;
  minimizeWindow: typeof actions.minimizeWindow;
  toggleMaximizeWindow: typeof actions.toggleMaximizeWindow;
}

export default connect<IProps>(TitleBar, {
  state: () =>
    createStructuredSelector({
      tabData: (rs: IRootState, props: IProps) =>
        rs.session.tabData[props.tab] || emptyObj,
      maximized: (rs: IRootState) => rs.ui.mainWindow.maximized,
      focused: (rs: IRootState) => rs.ui.mainWindow.focused,
    }),
  dispatch: dispatch => ({
    navigate: dispatcher(dispatch, actions.navigate),
    hideWindow: dispatcher(dispatch, actions.hideWindow),
    minimizeWindow: dispatcher(dispatch, actions.minimizeWindow),
    toggleMaximizeWindow: dispatcher(dispatch, actions.toggleMaximizeWindow),
  }),
});
