while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployService.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n----> Deploying React bundle $service to $hostname with $key\n"

# Step 1: Build the distribution package
printf "\n----> Build the distribution package\n"
rm -rf build
mkdir build

npm install
npm run build

cp -rf dist build/public
cp service/*.js build
cp service/*.json build

# Step 2: Clear previous deployment on the server
printf "\n----> Clearing out previous distribution on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/${service}
mkdir -p services/${service}
ENDSSH

# Step 3: Copy files to the server
printf "\n----> Copy the distribution package to the target\n"
scp -r -i "$key" build/* ubuntu@$hostname:services/$service

# Step 4: Start or restart the service
printf "\n----> Deploy the service on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
cd services/${service}

npm install

pm2 describe ${service} > /dev/null 2>&1
if [ \$? -eq 0 ]; then
    pm2 restart ${service}
else
    pm2 start index.js --name ${service}
fi

pm2 save
ENDSSH

# Step 5: Clean up local build files
printf "\n----> Removing local copy of the distribution package\n"
rm -rf build
rm -rf dist