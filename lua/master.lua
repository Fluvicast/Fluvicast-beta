
-- This file allows running user scripts in a sandboxed environment

-- Fluvicast-specific CLI properties
-- usage : lua master.lua username path/to/script.lua
--  ... where username is the name of the owner of the site (username.fluvicast.me) and
--      path/to/script.lua the path from the user's folder to the script (excluding the user's folder name)
local username = arg[1]
local filename = arg[2]
-- TODO: Make sure the pattern for the username is the correct one
if username == nil or (not string.find(username, "^[%w]+$")) or string.len(username) < 6 or string.len(username) > 30 then
    print('{"error":true,"message":"Invalid username."}')
elseif filename == nil then
    print('{"error":true,"message":"No file specified."}')
elseif not string.find(filename, "^[%w_%-%/]+%.lua$") then
    print('{"error":true,"message":"Not a valid file name."}')
else
    -- Initialize MongoDB connection
    local mongo = require('mongo')
    local client = mongo.Client('mongodb://127.0.0.1')

    -- Read JSON data from STDIN
    local json = require('json')
    -- Boy I do sure hope Lua will reach the io.read() before NodeJS starts printing to STDIN, else the whole program crashes :) :) :)
    print("Ready")
    local json_data = io.read();
    local fl_data = json.decode(json_data)
    
    -- Prepare the response object
    local res
    res = {
        cookies = {}, -- set a cookie with res.cookies["cookiename"] = "cookievalue";
        response = "",
    }
    
    -- Set the environment
    local env = {
        assert = assert,
        error = error,
        ipairs = ipairs,
        next = next,
        pairs = pairs,
        pcall = pcall,
        -- print = print,
        print = function() error("\"print\" is disabled on Fluvicast - use the built-in methods!") end,
        select = select,
        tonumber = tonumber,
        tostring = tostring,
        type = type,
        unpack = unpack,
        _VERSION = _VERSION, -- is that a good idea?
        xpcall = xpcall,
        
        -- are coroutines relevant? user scripts shouldn't really multitask...
        coroutine = {
            create = coroutine.create,
            resume = coroutine.resume,
            running = coroutine.running,
            status = coroutine.status,
            wrap = coroutine.wrap,
            --yield = coroutine.yield,    -- http://lua-users.org/wiki/SandBoxes says "probably - assuming caller handles this" - needs better checking
        },
        
        string = {
            byte = string.byte,
            char = string.char,
            dump = function() error("\"string.dump\" is disabled on Fluvicast") end,
            find = string.find,
            format = string.format,
            gmatch = string.gmatch,
            gsub = string.gsub,
            len = string.len,
            lower = string.lower,
            match = string.match,
            rep = string.rep,
            reverse = string.reverse,
            sub = string.sub,
            upper = string.upper,
        },
        math = {
            abs = math.abs,
            acos = math.acos,
            asin = math.asin,
            atan = math.atan,
            atan2 = math.atan2,
            ceil = math.ceil,
            cos = math.cos,
            cosh = math.cosh,
            deg = math.deg,
            exp = math.exp,
            floor = math.floor,
            fmod = math.fmod,
            frexp = math.frexp,
            huge = math.huge,
            ldexp = math.ldexp,
            log = math.log,
            log10 = math.log10,
            max = math.max,
            min = math.min,
            modf = math.modf,
            pi = math.pi,
            pow = math.pow,
            rad = math.rad,
            random = math.random, -- (see below)
            randomseed = math.randomseed, -- Added because the script will not use unseeded random after the sandbox will be finished
            sin = math.sin,
            sinh = math.sinh,
            sqrt = math.sqrt,
            tan = math.tan,
            tanh = math.tanh,
        },
        os = {
            clock = os.clock,
            difftime = os.difftime,
            time = os.time,
        },
        Database = {
            -- TODO: Check how secure this is
            getCollection = function(name) return client:getCollection('fluvicast-user-' .. username, name) end,
        },
        Request = fl_data,
        Response = res,
    }
    
    -- Sandbox
    -- run code under environment [Lua 5.2]
    local function run(file)
        local untrusted_function, message = loadfile(file, 't', env)
        if not untrusted_function then return nil, message end
        return pcall(untrusted_function)
    end
    
    math.randomseed(os.time())
    local success, msg = run("/var/u-fluvicast/lua/users/" .. username .. "/" .. filename)
    if not success then
        -- TODO: Log error (msg) for the user to see
        -- print(msg)
	print(json.encode({error = true, message = msg}))
    else
        if env.Response
          and env.Response.response and type(env.Response.response) == "string"
          and env.Response.cookies and type(env.Response.cookies) == "table"
          then
            env.Response.error = false
            print(json.encode(env.Response))
        else
            -- TODO: Handle error (returned an incorrect structure)
            print('{"error":true,"message":"Wrong structure in the Response object"}')
        end
    end
end
