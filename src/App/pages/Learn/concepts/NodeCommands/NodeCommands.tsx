import React, { useState, useRef, useEffect } from 'react';
import { FiTerminal, FiSend, FiInfo, FiChevronRight, FiSearch, FiBook, FiCommand, FiZap, FiAward, FiStar } from 'react-icons/fi';
import './NodeCommands.css';

interface CommandInfo {
  command: string;
  description: string;
  args: string[];
  category: string;
  example?: string;
  details?: string;
  xp: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface CommandCategory {
  name: string;
  description: string;
  commands: CommandInfo[];
  totalXP: number;
}

interface ConsoleLine {
  type: 'command' | 'output' | 'success' | 'error' | 'achievement' | 'tutorial';
  content: string;
  timestamp: number;
}

const NodeCommands: React.FC = () => {
  const [categories, setCategories] = useState<CommandCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCommand, setSelectedCommand] = useState<CommandInfo | null>(null);
  const [totalXP, setTotalXP] = useState(0);
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [lastAchievement, setLastAchievement] = useState('');
  
  const consoleEndRef = useRef<HTMLDivElement>(null);

  const addConsoleLine = (line: ConsoleLine) => {
    setConsoleLines(prev => [...prev, line]);
    setTimeout(() => {
      consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const showTutorial = () => {
    const tutorialLines = [
      "🎮 Welcome to the Evrmore RPC Explorer! 🚀",
      "Here you'll learn about all the powerful commands available in the Evrmore node.",
      "Each command you learn and try will earn you XP points! 📈",
      "Start by selecting a category from the left panel or searching for specific commands.",
      "Try your first command by typing 'help' in the console below! ⌨️"
    ];

    tutorialLines.forEach((line, index) => {
      setTimeout(() => {
        addConsoleLine({
          type: 'tutorial',
          content: line,
          timestamp: Date.now() + index
        });
      }, index * 1000);
    });
  };

  const executeCommand = async (command: string) => {
    try {
      addConsoleLine({ type: 'command', content: `> ${command}`, timestamp: Date.now() });

      const [method, ...params] = command.split(' ');
      const response = await fetch(`http://localhost:8001/evrmore/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      
      // Add XP for successful command execution
      if (selectedCommand) {
        const xpGained = selectedCommand.xp;
        setTotalXP(prev => prev + xpGained);
        
        // Show achievement popup
        setLastAchievement(`Command Master: ${selectedCommand.command}`);
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 3000);
        
        addConsoleLine({
          type: 'achievement',
          content: `🏆 Achievement Unlocked: Executed ${selectedCommand.command} (+${xpGained} XP)`,
          timestamp: Date.now()
        });
      }

      addConsoleLine({
        type: 'output',
        content: JSON.stringify(result, null, 2),
        timestamp: Date.now()
      });

      return JSON.stringify(result, null, 2);
    } catch (error: any) {
      addConsoleLine({
        type: 'error',
        content: `Error: ${error.message}`,
        timestamp: Date.now()
      });
      throw error;
    }
  };

  const parseHelpResponse = (response: string) => {
    const categories: CommandCategory[] = [];
    let currentCategory: CommandCategory | null = null;
    
    const lines = response.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('==') && trimmedLine.endsWith('==')) {
        const categoryName = trimmedLine.replace(/=/g, '').trim();
        currentCategory = {
          name: categoryName,
          description: getCategoryDescription(categoryName),
          commands: [],
          totalXP: 0
        };
        categories.push(currentCategory);
      } else if (currentCategory && /^[a-zA-Z]/.test(trimmedLine)) {
        // Split the line into command and arguments
        const parts = trimmedLine.split(' ');
        const command = parts[0];
        const description = getCommandDescription(command);
        const args = parts.slice(1).filter(arg => arg.trim());
        
        const commandXP = calculateCommandXP(command, args.length);
        currentCategory.totalXP += commandXP;
        
        currentCategory.commands.push({
          command: command.trim(),
          description: description,
          args,
          category: currentCategory.name,
          example: getCommandExample(command.trim()),
          xp: commandXP,
          difficulty: getCommandDifficulty(command, args.length)
        });
      }
    });
    
    return categories;
  };

  const getCommandDescription = (command: string): string => {
    const descriptions: { [key: string]: string } = {
      // Asset commands
      'getassetdata': 'Get detailed information about an asset',
      'issue': 'Create a new asset on the blockchain',
      'transfer': 'Transfer assets between addresses',
      'listassets': 'List all assets on the blockchain',
      'reissue': 'Reissue additional units of an existing asset',
      
      // Blockchain commands
      'getblock': 'Get detailed information about a block',
      'getblockcount': 'Get the current block height',
      'getbestblockhash': 'Get the hash of the best block',
      'getdifficulty': 'Get the current network difficulty',
      
      // Network commands
      'getnetworkinfo': 'Get information about the network',
      'getpeerinfo': 'Get information about connected peers',
      'addnode': 'Add or remove a node from the network',
      
      // Wallet commands
      'getnewaddress': 'Generate a new address',
      'sendtoaddress': 'Send EVR to an address',
      'getbalance': 'Get wallet balance',
      'listunspent': 'List unspent transaction outputs',
      
      // Mining commands
      'getmininginfo': 'Get mining-related information',
      'getblocktemplate': 'Get block template for mining',
      'submitblock': 'Submit a mined block to the network'
    };
    
    return descriptions[command] || 'Execute the command to learn more';
  };

  const calculateCommandXP = (command: string, argsCount: number): number => {
    let xp = 10; // Base XP
    
    // More XP for commands with more arguments
    xp += argsCount * 5;
    
    // Bonus XP for advanced commands
    if (['createrawtransaction', 'signrawtransaction', 'issue'].includes(command)) {
      xp += 20;
    }
    
    return xp;
  };

  const getCommandDifficulty = (command: string, argsCount: number): 'Beginner' | 'Intermediate' | 'Advanced' => {
    if (argsCount >= 3 || ['createrawtransaction', 'signrawtransaction', 'issue'].includes(command)) {
      return 'Advanced';
    }
    if (argsCount >= 1 || command.includes('raw') || command.includes('asset')) {
      return 'Intermediate';
    }
    return 'Beginner';
  };

  const getCategoryDescription = (category: string): string => {
    const descriptions: { [key: string]: string } = {
      'Addressindex': 'Commands for querying address-related information',
      'Assets': 'Create and manage Evrmore native assets',
      'Blockchain': 'Query and interact with the blockchain',
      'Control': 'Control the Evrmore node',
      'Generating': 'Block generation and mining controls',
      'Messages': 'Handle on-chain messaging',
      'Mining': 'Mining operations and block template management',
      'Network': 'Network connection and peer management',
      'Rawtransactions': 'Create and manipulate raw transactions',
      'Restricted assets': 'Manage restricted asset operations',
      'Rewards': 'Handle asset rewards and distributions',
      'Util': 'Utility functions',
      'Wallet': 'Wallet operations and management'
    };
    return descriptions[category] || 'Evrmore node commands';
  };

  const getCommandExample = (command: string): string => {
    // Add real examples for common commands
    const examples: { [key: string]: string } = {
      'help': 'help "getblock"',
      'getblock': 'getblock "00000000c937983704a73af28acdec37b049d214adbda81d7e2a3dd146f6ed09" 2',
      'getblockcount': 'getblockcount',
      'listassets': 'listassets "ASSET_NAME" true 10 0',
      'sendtoaddress': 'sendtoaddress "address" 0.1 "donation" "senders note"'
    };
    return examples[command] || `${command} [arguments]`;
  };

  useEffect(() => {
    const helpResponse = `🎮 Welcome to the Evrmore RPC Explorer! 🚀

Here you'll learn about all the powerful commands available in the Evrmore node.
Each command you learn and try will earn you XP points! 

== Addressindex ==
getaddressbalance
getaddressdeltas
getaddressmempool
getaddresstxids
getaddressutxos

== Assets ==
getassetdata "asset_name"
getcacheinfo 
getsnapshot "asset_name" block_height
issue "asset_name" qty "( to_address )" "( change_address )" ( units ) ( reissuable ) ( has_ipfs ) "( ipfs_hash )"
issueunique "root_name" [asset_tags] ( [ipfs_hashes] ) "( to_address )" "( change_address )"
listaddressesbyasset "asset_name" (onlytotal) (count) (start)
listassetbalancesbyaddress "address" (onlytotal) (count) (start)
listassets "( asset )" ( verbose ) ( count ) ( start )
listmyassets "( asset )" ( verbose ) ( count ) ( start ) (confs) 
purgesnapshot "asset_name" block_height
reissue "asset_name" qty "to_address" "change_address" ( reissuable ) ( new_units) "( new_ipfs )" 
transfer "asset_name" qty "to_address" "message" expire_time "change_address" "asset_change_address"
transferfromaddress "asset_name" "from_address" qty "to_address" "message" expire_time "evr_change_address" "asset_change_address"
transferfromaddresses "asset_name" ["from_addresses"] qty "to_address" "message" expire_time "evr_change_address" "asset_change_address"

== Blockchain ==
clearmempool
decodeblock "blockhex"
getbestblockhash
getblock "blockhash" ( verbosity ) 
getblockchaininfo
getblockcount
getblockhash height
getblockhashes timestamp
getblockheader "hash" ( verbose )
getchaintips
getchaintxstats ( nblocks blockhash )
getdifficulty
getmempoolancestors txid (verbose)
getmempooldescendants txid (verbose)
getmempoolentry txid
getmempoolinfo
getrawmempool ( verbose )
getspentinfo
gettxout "txid" n ( include_mempool )
gettxoutproof ["txid",...] ( blockhash )
gettxoutsetinfo
preciousblock "blockhash"
pruneblockchain
savemempool
verifychain ( checklevel nblocks )
verifytxoutproof "proof"

== Control ==
getinfo
getmemoryinfo ("mode")
getrpcinfo
help ( "command" )
stop
uptime

== Generating ==
generate nblocks ( maxtries )
generatetoaddress nblocks address (maxtries)
getgenerate
setgenerate generate ( genproclimit )

== Messages ==
clearmessages 
sendmessage "channel_name" "ipfs_hash" (expire_time)
subscribetochannel 
unsubscribefromchannel 
viewallmessagechannels 
viewallmessages 

== Mining ==
getblocktemplate ( TemplateRequest )
getevrprogpowhash "header_hash" "mix_hash" nonce, height, "target"
getmininginfo
getnetworkhashps ( nblocks height )
pprpcsb "header_hash" "mix_hash" "nonce"
prioritisetransaction <txid> <dummy value> <fee delta>
submitblock "hexdata"  ( "dummy" )

== Network ==
addnode "node" "add|remove|onetry"
clearbanned
disconnectnode "[address]" [nodeid]
getaddednodeinfo ( "node" )
getconnectioncount
getnettotals
getnetworkinfo
getpeerinfo
listbanned
ping
setban "subnet" "add|remove" (bantime) (absolute)
setnetworkactive true|false

== Rawtransactions ==
combinerawtransaction ["hexstring",...]
createrawtransaction [{"txid":"id","vout":n},...] {"address":(amount or object),"data":"hex",...}
decoderawtransaction "hexstring"
decodescript "hexstring"
fundrawtransaction "hexstring" ( options )
getrawtransaction "txid" ( verbose )
sendrawtransaction "hexstring" ( allowhighfees )
signrawtransaction "hexstring" ( [{"txid":"id","vout":n,"scriptPubKey":"hex","redeemScript":"hex"},...] ["privatekey1",...] sighashtype )
testmempoolaccept ["rawtxs"] ( allowhighfees )

== Restricted assets ==
addtagtoaddress tag_name to_address (change_address) (asset_data)
checkaddressrestriction address restricted_name
checkaddresstag address tag_name
checkglobalrestriction restricted_name
freezeaddress asset_name address (change_address) (asset_data)
freezerestrictedasset asset_name (change_address) (asset_data)
getverifierstring restricted_name
issuequalifierasset "asset_name" qty "( to_address )" "( change_address )" ( has_ipfs ) "( ipfs_hash )"
issuerestrictedasset "asset_name" qty "verifier" "to_address" "( change_address )" (units) ( reissuable ) ( has_ipfs ) "( ipfs_hash )"
isvalidverifierstring verifier_string
listaddressesfortag tag_name
listaddressrestrictions address
listglobalrestrictions
listtagsforaddress address
reissuerestrictedasset "asset_name" qty to_address ( change_verifier ) ( "new_verifier" ) "( change_address )" ( new_units ) ( reissuable ) "( new_ipfs )"
removetagfromaddress tag_name to_address (change_address) (asset_data)
transferqualifier "qualifier_name" qty "to_address" ("change_address") ("message") (expire_time) 
unfreezeaddress asset_name address (change_address) (asset_data)
unfreezerestrictedasset asset_name (change_address) (asset_data)

== Restricted ==
viewmyrestrictedaddresses 
viewmytaggedaddresses 

== Rewards ==
cancelsnapshotrequest "asset_name" block_height
distributereward "asset_name" snapshot_height "distribution_asset_name" gross_distribution_amount ( "exception_addresses" ) ("change_address") ("dry_run")
getdistributestatus "asset_name" snapshot_height "distribution_asset_name" gross_distribution_amount ( "exception_addresses" )
getsnapshotrequest "asset_name" block_height
listsnapshotrequests ["asset_name" [block_height]]
requestsnapshot "asset_name" block_height

== Util ==
createmultisig nrequired ["key",...]
estimatefee nblocks
estimatesmartfee conf_target ("estimate_mode")
signmessagewithprivkey "privkey" "message"
validateaddress "address"
verifymessage "address" "signature" "message"

== Wallet ==
abandontransaction "txid"
abortrescan
addmultisigaddress nrequired ["key",...] ( "account" )
addwitnessaddress "address"
backupwallet "destination"
bumpfee has been deprecated on the EVR Wallet.
dumpprivkey "address"
dumpwallet "filename"
encryptwallet "passphrase"
getaccount "address"
getaccountaddress "account"
getaddressesbyaccount "account"
getbalance ( "account" minconf include_watchonly )
getmasterkeyinfo
getmywords ( "account" )
getnewaddress ( "account" )
getrawchangeaddress
getreceivedbyaccount "account" ( minconf )
getreceivedbyaddress "address" ( minconf )
gettransaction "txid" ( include_watchonly )
getunconfirmedbalance
getwalletinfo
importaddress "address" ( "label" rescan p2sh )
importmulti "requests" ( "options" )
importprivkey "privkey" ( "label" ) ( rescan )
importprunedfunds
importpubkey "pubkey" ( "label" rescan )
importwallet "filename"
keypoolrefill ( newsize )
listaccounts ( minconf include_watchonly)
listaddressgroupings
listlockunspent
listreceivedbyaccount ( minconf include_empty include_watchonly)
listreceivedbyaddress ( minconf include_empty include_watchonly)
listsinceblock ( "blockhash" target_confirmations include_watchonly include_removed )
listtransactions ( "account" count skip include_watchonly)
listunspent ( minconf maxconf  ["addresses",...] [include_unsafe] [query_options])
listwallets
lockunspent unlock ([{"txid":"txid","vout":n},...])
move "fromaccount" "toaccount" amount ( minconf "comment" )
removeprunedfunds "txid"
rescanblockchain ("start_height") ("stop_height")
sendfrom "fromaccount" "toaddress" amount ( minconf "comment" "comment_to" )
sendfromaddress "from_address" "to_address" amount ( "comment" "comment_to" subtractfeefromamount replaceable conf_target "estimate_mode")
sendmany "fromaccount" {"address":amount,...} ( minconf "comment" ["address",...] replaceable conf_target "estimate_mode")
sendtoaddress "address" amount ( "comment" "comment_to" subtractfeefromamount replaceable conf_target "estimate_mode")
setaccount "address" "account"
settxfee amount
signmessage "address" "message"`;

    const parsedCategories = parseHelpResponse(helpResponse);
    setCategories(parsedCategories);
    setTotalXP(parsedCategories.reduce((sum, cat) => sum + cat.totalXP, 0));
    showTutorial();
  }, []);

  return (
    <div className="rpc-explorer">
      <header className="rpc-explorer-header">
        <div className="rpc-explorer-title">
          <div className="title-icon">🎮</div>
          <div>
            <h1>Evrmore RPC Explorer</h1>
            <p>Learn and master Evrmore node commands</p>
          </div>
          <div className="xp-counter">
            <span>🏆</span>
            <span>{totalXP} XP Available</span>
          </div>
        </div>
        
        <div className="rpc-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search commands..."
          />
        </div>
      </header>

      <div className="rpc-explorer-content">
        <aside className="rpc-categories">
          {categories.map((category) => (
            <div
              key={category.name}
              className={`category-section ${
                selectedCategory === category.name ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <div className="category-header">
                <h2>
                  <span className="category-icon">📦</span>
                  {category.name}
                </h2>
                <div className="category-info">
                  <p>{category.description}</p>
                  <div className="category-xp">
                    <span>🏆</span>
                    {category.totalXP} XP
                  </div>
                </div>
              </div>
            </div>
          ))}
        </aside>

        <main className="command-details">
          {selectedCategory && (
            <div className="commands-grid">
              {categories
                .find((cat) => cat.name === selectedCategory)
                ?.commands.map((command) => (
                  <div
                    key={command.command}
                    className={`command-card ${
                      selectedCommand?.command === command.command ? 'active' : ''
                    }`}
                    onClick={() => setSelectedCommand(command)}
                  >
                    <div className="command-header">
                      <h3>{command.command}</h3>
                      <span className="command-icon">⚡</span>
                    </div>
                    <p className="command-description">{command.description}</p>
                    <div className="command-difficulty">
                      <span>💪</span>
                      {command.difficulty}
                      <span className="command-xp">{command.xp} XP</span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {!selectedCategory && (
            <div className="rpc-welcome">
              <div className="rpc-welcome-message">
                Welcome to the Evrmore RPC Explorer! 🚀
                <br /><br />
                Here you'll learn about all the powerful commands available in the Evrmore node.
                Each command you learn and try will earn you XP points!
                <br /><br />
                Start by selecting a category from the left panel or searching for specific commands.
              </div>
            </div>
          )}
        </main>
      </div>

      {showAchievement && (
        <div className="achievement-popup">
          <FiAward className="achievement-icon" />
          <div className="achievement-content">
            <h3>{lastAchievement}</h3>
            <p>Keep exploring to earn more achievements!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeCommands; 