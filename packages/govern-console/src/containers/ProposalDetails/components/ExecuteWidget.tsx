/* eslint-disable */
import React, { memo, useEffect, useMemo, useState } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { InputField } from 'components/InputFields/InputField';
import { PROPOSAL_STATES } from 'utils/states'

import { styled } from '@material-ui/core/styles';

const Widget = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    minHeight: '118px',
    boxSizing: 'border-box',
    background: '#FFFFFF',
    border: '2px solid #ECF1F7',
    boxShadow: '0px 6px 6px rgba(180, 193, 228, 0.35)',
    borderRadius: '8px',
    marginBottom: '23px',
    padding: '36px 27px',
    '& div': {
        display: 'block',
        margin: 'auto',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '9px',
    },
    '& button': {
        marginTop: '5px',
    },
});


const ExecuteWidget: React.FC<any> = ({
    containerEventExecute,
    currentState,
    executionTime,
    onExecuteProposal    
}) => {

    if (containerEventExecute) {
        return (
            <Widget>
                <div
                    style={{
                        fontFamily: 'Manrope',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: '18px',
                        color: '#7483B3',
                    }}
                >
                    <strong>Executed At:</strong>{containerEventExecute.createdAt} <br></br>
                    <strong>Results:</strong>{containerEventExecute.execResults} <br></br>
                </div>
            </Widget>
        )
    }
    

    if(currentState !== PROPOSAL_STATES.SCHEDULED) {
        return (
            <p></p>
        )
    }

    return (
        <Widget>
            <div
                style={{
                    fontFamily: 'Manrope',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: '18px',
                    color: '#7483B3',
                }}
            >
                {Date.now() - executionTime * 1000 >= 15000 // 15 seconds latency due to block.timestamp sometimes 15 seconds wrong.
                    ?
                    <ANButton
                        label="Execute"
                        height="45px"
                        width="372px"
                        style={{ margin: 'auto' }}
                        onClick={onExecuteProposal}
                        buttonType="primary"
                    />
                    :
                    <h2>
                        Proposal can't be executed until {new Date(executionTime * 1000 + 15000).toLocaleDateString(
                        'en-US',
                    ) + ' ' + new Date(executionTime * 1000 + 15000).toLocaleTimeString(
                        'en-US',
                    )}
                    </h2>
                }
            </div>
        </Widget>
    )

    return (
        <p></p>
    )

}

export default memo(ExecuteWidget);
