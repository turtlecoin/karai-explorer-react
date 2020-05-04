import React, { Component } from 'react';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { sleep } from '../Utils/sleep';
import { Searchbar } from '../Components/Searchbar';
import { darkMode } from '../App';
import { Breadcrumbs } from '../Components/Breadcrumbs';
import { BlockTable } from '../Components/BlockTable';
import { client } from '..';
import { offsetIncrement } from '../Constants/config';
import { Footer } from '../Components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes } from '@fortawesome/free-solid-svg-icons';

type State = {
  blocks: any[];
  displayedBlockCount: number;
  blockTransactions: any[];
  offset: number;
  loading: boolean;
};

type Props = {
  match: any;
};

class Blocks extends Component<Props, State> {
  state: State;
  expandRefs: any[];
  loadMoreRef: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      blocks: [],
      blockTransactions: [],
      displayedBlockCount: 0,
      offset: 0,
      loading: false,
    };
    this.getBlocks = this.getBlocks.bind(this);
    this.expandRefs = [];
  }

  async componentDidMount() {
    await this.getBlocks();

    client.onmessage = (message) => {
      const msg = JSON.parse(message.data as string);

      if (msg.type === 'block') {
        const { blocks, displayedBlockCount } = this.state;
        blocks.unshift(msg.message);

        while (blocks.length > displayedBlockCount) {
          blocks.pop();
        }

        this.setState({
          blocks,
        });
      }
    };
  }

  async componentWillUnmount() {
    client.onmessage = () => {};
  }

  async getBlocks() {
    const { offset, blocks } = this.state;
    const res = await axios.get(`${process.env.REACT_APP_API_URI}/blocks`, {
      params: {
        offset,
      },
    });
    if (res.data.data.length === 0) {
      this.setState({
        offset: offset - offsetIncrement,
      });
      this.showTip();
      return;
    }
    const mergedBlocks = [...blocks, ...res.data.data];
    this.setState({
      blocks: mergedBlocks,
      displayedBlockCount: mergedBlocks.length,
    });
  }

  async loadMore() {
    const { offset } = this.state;
    this.setState(
      {
        offset: offset + offsetIncrement,
      },
      () => {
        this.getBlocks();
      }
    );
  }

  async showTip() {
    ReactTooltip.show(this.loadMoreRef);
    await sleep(1000);
    ReactTooltip.hide(this.loadMoreRef);
  }

  render() {
    const { blocks } = this.state;
    const { match } = this.props;

    return (
      <div className="container react-root Site">
        <Breadcrumbs match={match} />
        <main className="Site-content">
          <Searchbar query="" />
          <div className="panel">
            <p className="panel-heading">
              <span className="panel-heading-icon">
                <FontAwesomeIcon icon={faCubes} />
              </span>
              Blocks
            </p>
            {BlockTable(blocks, match)}
          </div>
          <br />
          {blocks.length > 0 && (
            <div className="frame">
              <div
                className={`button ${darkMode ? 'is-black' : ''}`}
                ref={(ref) => (this.loadMoreRef = ref)}
                data-tip="No blocks found"
                data-type="error"
                onClick={() => {
                  const { offset } = this.state;
                  this.setState(
                    {
                      offset: offset + offsetIncrement,
                    },
                    () => {
                      this.getBlocks();
                    }
                  );
                }}
              >
                Load More
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }
}

export default Blocks;
