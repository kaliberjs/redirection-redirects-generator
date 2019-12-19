# Wordpress Redirection redirects generator

A small and simple library for transforming a .csv file that contains old and new site urls to a valid JSON file for the Wordpress Redirection plugin.

## How to use

Create a .csv file that contains the old and new url comma seperated
```
/old/test1/,/new/test1/
/old/test2/,/new/test2/
```

Run the command with the correct file path  
`yarn generate-file --file=scripts/example.csv`
