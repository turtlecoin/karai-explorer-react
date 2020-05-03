import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { prettyPrint, formatLikeCurrency } from '../Utils/prettyPrint';

export const TransactionTable = (transactions: any[], match: any) => {
  if (transactions.length === 0 || !transactions) {
    return null;
  }
  return (
    <div className="table-wrapper">
      <table className="table is-fullwidth is-scrollable is-hoverable is-striped is-family-monospace">
        <thead>
          <tr>
            <th />
            <th className="tx-hash-column">Hash</th>
            <th className="tx-amount-column has-text-right">Amount</th>
            <th className="tx-fee-column has-text-right">Fee</th>
            <th className="tx-size-column has-text-right">Size</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx: any) => {
            if (tx.fee < 0) {
              tx.fee = 0;
            }

            console.log(typeof tx.amount);

            return (
              <tr key={tx.hash}>
                <td>
                  <Link
                    to={`/transactions/${tx.hash}`}
                    aria-label="expand more details"
                  >
                    {' '}
                    <FontAwesomeIcon icon={faExpand} />
                  </Link>
                </td>
                <td className="tx-hash-column">{tx.hash}</td>
                <td className="tx-amount-column has-text-right">
                  {prettyPrint(tx.amount)}
                </td>
                <td className="tx-fee-column has-text-right">{prettyPrint(tx.fee)}</td>
                <td className="tx-size-column has-text-right">{formatLikeCurrency(tx.size)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
