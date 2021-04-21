/* eslint-disable */
import React, { useState, memo, useRef } from 'react';
import { ANButton } from '../../components/Button/ANButton';
import { useTheme, styled } from '@material-ui/core/styles';
import backButtonIcon from '../../images/back-btn.svg';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { InputField } from '../../components/InputFields/InputField';
import { useHistory } from 'react-router-dom';
import CreateDaoImage from '../../images/svgs/CreateDao.svg';
import CreateDaoInProgressImage from '../../images/svgs/CreateDaoInProgress.svg';
import GreenTickImage from '../../images/svgs/green_tick.svg';
import CrossImage from '../../images/svgs/cross.svg';
import { BlueSwitch } from '../../components/Switchs/BlueSwitch';
import { BlueCheckbox } from '../../components/Checkboxs/BlueCheckbox';
import { BlueProgressBar } from '../../components/ProgressBars/BlueProgressBar';
import { goodConfig } from '../../utils/goodConfig'
import { useWallet } from '../../EthersWallet';
import {
  createDao,
  CreateDaoParams,
  CreateDaoOptions,
  Token,
  getToken
} from '@aragon/govern';

enum CreateDaoStatus {
  PreCreate,
  InProgress,
  Successful,
  Failed,
}

const aragonFreeVotingUrl = '#';

interface FormProps {
  /*
        change status of DAO creation
    */
  submitFormAction(): void;

  /*
        cancel form and go back
    */
  cancelForm(): void;

  /*
        submit form values to be transacted on chain
    */
  submitCreateDao(
    isExistingToken: boolean,
    existingTokenAddress: string,
    tokenName: string,
    tokenSymbol: string,
    isUseProxyChecked: boolean,
    daoName: string,
    isUseFreeVotingChecked: boolean
  ): void;
}

interface ProgressProps {
  /*
        value to be passed to progress bar: range 0-100
    */
  progressValue: number;
}

interface ResultProps {
  /**
      success of failed result
   */
  isSuccess: boolean;

  /*
        value to be passed to progress bar: range 0-100
    */
  postResultAction(): void;
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
  width: '365px',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: 18,
  lineHeight: '25px',
  color: '#7483AB',
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  margin: '0px 50px 0px 50px',
});

const optionTextStyle = {
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 18,
};

const NewDaoForm: React.FC<FormProps> = ({ submitFormAction, cancelForm, submitCreateDao }) => {
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
  const [isExistingToken, updateIsExistingToken] = useState(false);
  const [isUseProxyChecked, updateIsUseProxyChecked] = useState(true);
  const [isUseFreeVotingChecked, updateIsUseFreeVotingChecked] = useState(true);
  const daoName = useRef();
  const tokenName = useRef();
  const tokenSymbol = useRef();
  const existingTokenAddress = useRef();

  const onChangeDaoName = (val: any) => {
    daoName.current = val;
  };

  const onChangeTokenName = (val: any) => {
    tokenName.current = val;
  };

  const onChangeTokenSymbol = (val: any) => {
    tokenSymbol.current = val;
  };

  const onChangeExistingTokenAddress = (val: any) => {
    existingTokenAddress.current = val;
  };

  return (
    <div
      style={{
        justifyContent: 'center',
        display: 'flex',
      }}
    >
      <WrapperDiv>
        <BackButton onClick={cancelForm}>
          <img src={backButtonIcon} />
        </BackButton>
        <img src={CreateDaoImage} />
        <InputTitle>DAO Name</InputTitle>
        <InputField
          label=""
          onInputChange={onChangeDaoName}
          height="46px"
          width="454px"
          placeholder={'Please insert your DAO name...'}
          value={daoName.current}
        ></InputField>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: '25px',
            verticalAlign: 'middle',
            lineHeight: '40px',
          }}
        >
          <div style={optionTextStyle}>{'Create new token'}</div>
          <BlueSwitch
            checked={isExistingToken}
            onChange={() => {
              updateIsExistingToken(!isExistingToken);
            }}
            name="checked"
          />
          <div style={optionTextStyle}>{'Use existing token'}</div>
        </div>
        {!isExistingToken ? (
          <div>
            <InputTitle>Token</InputTitle>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <InputField
                label=""
                onInputChange={onChangeTokenName}
                value={tokenName.current}
                height="46px"
                width="200px"
                placeholder={"Your Token's Name?"}
              />

              <InputField
                label=""
                onInputChange={onChangeTokenSymbol}
                height="46px"
                width="200px"
                placeholder={"Your Token's Symbol?"}
                value={tokenSymbol.current}
              />
            </div>
          </div>
        ) : (
          <div>
            <InputTitle>Token Address</InputTitle>
            <InputField
              label=""
              onInputChange={onChangeExistingTokenAddress}
              height="46px"
              width="451px"
              placeholder={
                'Please insert existing token ether address (0x000...)'
              }
              value={existingTokenAddress.current}
            />
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '25px',
          }}
        >
          <div
            style={{
              marginTop: -5,
            }}
          >
            <BlueCheckbox
              checked={isUseProxyChecked}
              onChange={() => {
                updateIsUseProxyChecked(!isUseProxyChecked);
              }}
            />
          </div>
          <div style={optionTextStyle}>
            Use Govern Agent Proxy - This will enable your DAO to use Aragon
            Govern main executer queue, and heavily decrease gas costs for your
            DAO deployment
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '25px',
          }}
        >
          <div
            style={{
              marginTop: -5,
            }}
          >
            <BlueCheckbox
              checked={isUseFreeVotingChecked}
              onChange={() => {
                updateIsUseFreeVotingChecked(!isUseFreeVotingChecked);
              }}
            />
          </div>
          <div style={optionTextStyle}>
            Use{' '}
            <a target="_blank" href={aragonFreeVotingUrl}>
              Aragon Voting
            </a>{' '}
            - This will enable your DAO to have free voting for you proposals
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
            onClick={() => {
              submitFormAction();
            }}
          />
        </div>
      </WrapperDiv>
    </div>
  );
};

const NewDaoProgress: React.FC<ProgressProps> = ({ progressValue }) => {
  const theme = useTheme();

  const WrapperDiv = styled(Paper)({
    width: 'min-content',
    background: theme.custom.white,
    height: 'auto',
    padding: '40px 20px 20px 20px',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    boxSizing: 'border-box',
    boxShadow: 'none',
  });

  return (
    <div
      style={{
        height: '80vh',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <WrapperDiv>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <img
            src={CreateDaoInProgressImage}
            style={{ width: '242px', marginLeft: 'auto', marginRight: 'auto' }}
          />
          <Title>Creating your DAO</Title>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <SubTitle>Hold tight your transaction is under process</SubTitle>
          </div>
          <BlueProgressBar
            variant="determinate"
            value={progressValue}
            style={{
              width: '370px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '20px',
            }}
          />
          <div
            style={{
              borderRadius: '10px',
              background: '#ECFAFF',
              width: '446px',
              height: '51px',
              lineHeight: '51px',
              textAlign: 'center',
              marginTop: '50px',
              fontFamily: 'Manrope',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontSize: 14,
              color: '#0176FF',
            }}
          >
            Please be patient and do not close this window until it finishes.
          </div>
        </div>
      </WrapperDiv>
    </div>
  );
};

const NewDaoCreationResult: React.FC<ResultProps> = ({
  isSuccess,
  postResultAction,
}) => {
  const theme = useTheme();

  const WrapperDiv = styled(Paper)({
    width: 'min-content',
    background: theme.custom.white,
    height: 'min-content',
    padding: '30px 20px 20px 20px',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    boxSizing: 'border-box',
    boxShadow: 'none',
  });
  return (
    <div
      style={{
        height: '80vh',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <WrapperDiv>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <img
            src={isSuccess ? GreenTickImage : CrossImage}
            style={{
              width: '88px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '88px',
            }}
          />
          <Title>
            {isSuccess ? 'Your DAO is ready' : 'Somthing went wrong'}
          </Title>
          <SubTitle>
            {isSuccess
              ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.Lorem ipsum dolor'
              : 'An error has occurred during the signature process. Do not worry, you can try again without losing your information.'}
          </SubTitle>
          <div
            style={{
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <ANButton
              width={'446px'}
              label={isSuccess ? 'Get started' : 'Ok, let’s try again'}
              type="primary"
              style={{ marginTop: 40 }}
              onClick={() => {
                postResultAction();
              }}
            />
          </div>
        </div>
      </WrapperDiv>
    </div>
  );
};

const NewDaoContainer: React.FC = () => {
  const [createDaoStatus, setCreateDaoStatus] = useState<CreateDaoStatus>(
    CreateDaoStatus.PreCreate,
  );
  const [progressPercent, setProgressPercent] = useState<number>(5);
  const history = useHistory();
  const context: any = useWallet();

  const onClickBackFromCreateDaoPage = () => {
    history.goBack();
  };

  const submitCreateDao = async (
    isExistingToken: boolean,
    existingTokenAddress: string,
    tokenName: string,
    tokenSymbol: string,
    isUseProxyChecked: boolean,
    daoName: string,
    isUseFreeVotingChecked: boolean
  ) => {
    let token: Token
    if (isExistingToken) {
      try {
        token = await getToken(existingTokenAddress, context.ethersProvider)
      } catch (error) {
        console.log(error)
        return false
      }
    } else {
      token = {
        tokenAddress: '',
        tokenDecimals: 18,
        tokenName: tokenName,
        tokenSymbol: tokenSymbol
      }
    }
    const createDaoParams: CreateDaoParams = {
      name: daoName,
      token,
      config: goodConfig,
      useProxies: isUseProxyChecked,
      useVocdoni: isUseFreeVotingChecked
    }

    try {
      const result: any = await createDao(createDaoParams)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  // TODO: simulateCreation to be removed later and substituted with "CreateDaoFunction"
  const simulateCreation = async () => {
    function delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    setCreateDaoStatus(CreateDaoStatus.InProgress);
    for (let index = 5; index < 100; index++) {
      await delay(10);
      setProgressPercent(index);
      console.log('progressPercent', progressPercent);
    }
    setCreateDaoStatus(CreateDaoStatus.Failed);
  };

  switch (createDaoStatus) {
    case CreateDaoStatus.PreCreate: {
      return (
        <NewDaoForm
          submitFormAction={simulateCreation}
          cancelForm={onClickBackFromCreateDaoPage}
          submitCreateDao={submitCreateDao}
        />
      );
    }
    case CreateDaoStatus.InProgress: {
      return <NewDaoProgress progressValue={progressPercent} />;
    }
    case CreateDaoStatus.Successful: {
      return (
        <NewDaoCreationResult
          isSuccess={true}
          postResultAction={() => {
            console.log('should go some where');
          }}
        />
      );
    }
    case CreateDaoStatus.Failed: {
      return (
        <NewDaoCreationResult
          isSuccess={false}
          postResultAction={() => {
            setCreateDaoStatus(CreateDaoStatus.PreCreate);
          }}
        />
      );
    }
    default: {
      return (
        <NewDaoForm
          submitFormAction={simulateCreation}
          cancelForm={onClickBackFromCreateDaoPage}
          submitCreateDao={submitCreateDao}
        />
      );
    }
  }
};

export default memo(NewDaoContainer);
