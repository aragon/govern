/* eslint-disable */
import React, { useState, useRef, memo, useCallback } from 'react';
import { ANButton } from '../../components/Button/ANButton';
import { useTheme, styled, Theme } from '@material-ui/core/styles';
import useStyles from '../../ReusableStyles';
import backButtonIcon from '../../images/back-btn.svg';
import Typography from '@material-ui/core/Typography';
import { HelpButton } from '../../components/HelpButton/HelpButton';
import TextArea from '../../components/TextArea/TextArea';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { NewActionModal } from '../../components/Modal/NewActionModal';
import { AddActionsModal } from '../../components/Modal/AddActionsModal';
import { InputField } from '../../components/InputFields/InputField';
import { useHistory } from 'react-router-dom';
import CreateDaoImage from '../../images/svgs/CreateDao.svg';
import CreateDaoInProgressImage from '../../images/svgs/CreateDaoInProgress.svg';
import { TwoSidedSwitch } from '../../components/TwoSidedSwitch/TwoSidedSwitch';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';

enum CreateDaoStatus {
    PreCreate,
    InProgress,
    Successful,
    Failed,
}

interface FormProps {
    setCreateDaoStatus(status: CreateDaoStatus): void
}

const BackButton = styled('div')({
    height: 25,
    width: 62,
    cursor: 'pointer',
    position: 'relative',
    left: -6,
});

const InputTitle = styled(Typography)({
    width: '454px',
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 18,
    lineHeight: '25px',
    color: '#7483AB',
});

const NewDaoForm: React.FC<FormProps> = ({
    setCreateDaoStatus
}) => {
    const theme = useTheme();

    const WrapperDiv = styled(Paper)({
        width: 'min-content',
        background: theme.custom.white,
        height: 'auto',
        padding: '50px',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        boxSizing: 'border-box',
        boxShadow: 'none',
    });

    const [isExistingToken, setIsExistingToken] = useState(false);
    const [isUseProxyChecked, setIsUseProxyChecked] = useState(true); 
    const [isUseFreeVotingChecked, setIsUseFreeVotingChecked] = useState(true); 

    return(
        <div 
            style={{
                justifyContent: 'center',
                display: 'flex',
                }}
        >
            <WrapperDiv>
                <BackButton>
                    <img src={backButtonIcon} />
                </BackButton>
                <img src={CreateDaoImage} />
                <InputTitle>DAO Name</InputTitle>
                <InputField
                    label=""
                    onInputChange={() => {
                    console.log('click');
                    }}
                    height="46px"
                    width="454px"
                    placeholder={'Please insert your DAO name...'}
                ></InputField>
                {/* <TwoSidedSwitch 
                    leftSide={'Create new token'}
                    rightSide={'Use existing token'}
                    getChecked={setIsExistingToken}
                /> */}
                <div 
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: '25px',
                        verticalAlign: 'middle'
                    }}
                >
                    <div>{'Create new token'}</div>
                    <Switch
                        checked={isExistingToken}
                        onChange={() => {setIsExistingToken(!isExistingToken)}}
                        name="checked"
                        color='primary'
                        // inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <div>{'Use existing token'}</div>
                </div>
                {!isExistingToken ? 
                <div>
                    <InputTitle>Token</InputTitle>
                    <div 
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                    >
                        <InputField
                            label=""
                            onInputChange={() => {
                            console.log('click');
                            }}
                            height="46px"
                            width="200px"
                            placeholder={"Your Token's Name?"}
                            />
                                
                        <InputField
                            label=""
                            onInputChange={() => {
                            console.log('click');
                            }}
                            height="46px"
                            width="200px"
                            placeholder={"Your Token's Symbol?"}
                            />
                    </div>
                </div>
                :
                <div>
                    <InputTitle>Token Address</InputTitle>
                    <InputField
                        label=""
                        onInputChange={() => {
                        console.log('click');
                        }}
                        height="46px"
                        width="451px"
                        placeholder={"Please insert existing token ether address (0x000...)"}
                        />
                </div>
                }

                <div 
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: '25px'
                    }}
                >
                    <Checkbox
                        checked={isUseProxyChecked}
                        onChange={() => { setIsUseProxyChecked(!isUseProxyChecked)}}
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <div>
                        Use Govern Agent Proxy - This will enable your DAO to use Aragon Govern main executer queue, and heavily decrease gas costs for your DAO deployment
                    </div>
                </div>

                <div 
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: '25px'
                    }}
                >
                    <Checkbox
                        checked={isUseFreeVotingChecked}
                        onChange={() => { setIsUseFreeVotingChecked(!isUseFreeVotingChecked); }}
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <div>
                        Use Aragon Voting - This will enable your DAO to have free voting for you proposals
                    </div>
                </div>
                <div 
                style={{
                    justifyContent: 'center',
                    display: 'flex',
                    }}
                >
                    <ANButton
                        label="Create new DAO"
                        type="primary"
                        style={{ marginTop: 40 }}
                        onClick={() => { setCreateDaoStatus(CreateDaoStatus.InProgress)}}
                    />
                </div>
            </WrapperDiv>
        </div>
    );
};

// TODO: NewDaoProgress
const NewDaoProgress: React.FC = () => {
    const theme = useTheme();
    const [progressPercent, setProgressPercent] = useState<number>(5);

    const WrapperDiv = styled(Paper)({
        width: 'min-content',
        background: theme.custom.white,
        height: 'auto',
        padding: '50px',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        boxSizing: 'border-box',
        boxShadow: 'none',
    });

    const Title = styled(Typography)({
        fontFamily: 'Manrope',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: 28,
        lineHeight: '38px',
        color: '#20232C',
        marginTop: 17,
        height: 50,
        display: 'flex',
        justifyContent: 'center',
    });

    const SubTitle = styled(Typography)({
        width: '454px',
        fontFamily: 'Manrope',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 18,
        lineHeight: '25px',
        color: '#7483AB',
        display: 'flex',
        justifyContent: 'center',
    });

    return(
        <div
        style={{
            justifyContent: 'center',
            display: 'flex',
            }}
        >
            <WrapperDiv>
                <div 
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        }}
                >
                    <img src={CreateDaoInProgressImage} style={{ width: '242px', marginLeft: 'auto', marginRight: 'auto'}} />
                    <Title>Creating your DAO</Title>
                    <SubTitle>Hold tight your transaction is under process</SubTitle>
                    <LinearProgress variant="determinate" value={progressPercent} style={{ width: '370px', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px'}}/>
                </div>
            </WrapperDiv>
        </div>
    );
}

// TODO: NewDaoCreationResult

const NewDaoContainer: React.FC = () => {
    const [createDaoStatus, setCreateDaoStatus] = useState<CreateDaoStatus>(CreateDaoStatus.PreCreate);
    // const history = useHistory();

    // const onClickBackFromCreateDaoPage = () => {
    //     history.goBack();
    // };

    switch(createDaoStatus) {
        case CreateDaoStatus.PreCreate: {
            return(
                <NewDaoForm 
                    setCreateDaoStatus={setCreateDaoStatus}
                />
            );
        }
        case CreateDaoStatus.InProgress: {
            return(
                <NewDaoProgress />
            );
        }
        default: {
            return(
                <NewDaoForm 
                    setCreateDaoStatus={setCreateDaoStatus}
                />
            );
        }
    }

};

export default memo(NewDaoContainer);