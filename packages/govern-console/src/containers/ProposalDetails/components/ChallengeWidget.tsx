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


const ChallengeWidget: React.FC<any> = ({
    containerEventChallenge,
    currentState,
    setChallengeReason,
    onChallengeProposal
}) => {

    if (containerEventChallenge) {
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
                    <strong>Reason:</strong>{containerEventChallenge.reason} <br></br>
                    <strong>Challenger:</strong>{containerEventChallenge.challenger} <br></br>
                    <strong>Challenged At:</strong>{containerEventChallenge.createdAt} <br></br>
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
                Challenge Reason
          </div>
            <InputField
                onInputChange={(value) => {
                    setChallengeReason(value);
                }}
                label={''}
                placeholder={''}
                height={'46px'}
                width={'372px'}
            // value={challengeReason.current}
            />
            <ANButton
                buttonType="primary"
                label="Challenge"
                height="45px"
                width="372px"
                style={{ margin: 'auto' }}
                onClick={() => onChallengeProposal()}
            />
        </Widget>
    )

}

export default memo(ChallengeWidget);
