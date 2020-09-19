export interface card {
	node: {
		url: string
		name: string
		primaryLanguage: {
			name: string
		}
		description: string
	}
}

export interface iconProps {
	icon: 'github' | 'email' | 'dev' | 'linkedin'
}

export interface indexProps {
	projects: Array<card>
}

export interface cardProps {
	project: card
}

const gqlQuery = `query {
	repositoryOwner(login: "safinsingh") {
	  ... on ProfileOwner {
		 pinnedItemsRemaining
		 itemShowcase {
			items(first: 6) {
			  edges {
				 node {
					... on Repository {
					  name
					  description
					  url
					  primaryLanguage {
						 name
					  }
					}
				 }
			  }
			}
		 }
	  }
	}
 }`

export const endpoint = async () => {
	const projects: any = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${process.env.TOKEN}`,
		},
		body: JSON.stringify({
			query: gqlQuery,
		}),
	})

	const ret = await projects.json()

	return {
		props: {
			projects:
				ret.data === undefined
					? []
					: ret.data.repositoryOwner.itemShowcase.items.edges,
		},
	}
}