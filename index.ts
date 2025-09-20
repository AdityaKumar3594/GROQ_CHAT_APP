import concurrently from 'concurrently';

concurrently([{
    name: 'server', command: 'bun run start', cwd: 'packages/server',prefixColor: 'cyan'
}, {
    name: 'client', command: 'bun run dev', cwd: 'packages/client',prefixColor: 'green' 
}])