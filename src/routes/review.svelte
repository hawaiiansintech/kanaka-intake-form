<script lang="ts">
	import { gqlRequest } from '$lib/graphql-client';

	import { gql } from 'graphql-request';
	import { onMount } from 'svelte';

	let message = '';

	let kanakaIntakeList: Array<any> = [];

	onMount(async () => {
		const data = await get_kanakaintake_list('public', '');
		console.log('data: ', data);
		kanakaIntakeList = data?.kanakaintake;
	});

	async function get_kanakaintake_list(role: string, jwt_token: string): Promise<any | undefined> {
		console.log(`get_kanakaintake_list(role, jwt_token)`);

		const query = gql`
			query kanakaintake_list {
				kanakaintake(order_by: { intake_id: asc }) {
					intake_id
					given_name
					family_name
					birth_date
					birth_place
					mom_given_name
					mom_family_name
					mom_birth_date
					mom_birth_place
					dad_given_name
					dad_family_name
					dad_birth_date
					dad_birth_place
					request_status
					create_timestamp
					owner_id
					mookuauhau_id
				}
			}
		`;
		const variables = {};

		let addHeaders = {
			'x-hasura-role': role
		};

		return await gqlRequest(query, variables, jwt_token, addHeaders);
	}
</script>

<h2>Kanaka Intake Records</h2>

<h3>Submitted records:</h3>

<div style="color:red">{message}</div>

{#if kanakaIntakeList}
	<div class="wrapper">
		<div class="row hdr">
			<div>intake id</div>
			<div>given name</div>
			<div>family name</div>
			<div>birth date</div>
			<div>birth place</div>
			<div>mom given name</div>
			<div>mom family name</div>
			<div>mom birth date</div>
			<div>mom birth place</div>
			<div>dad given name</div>
			<div>dad family name</div>
			<div>dad birth date</div>
			<div>dad birth place</div>
			<div>load status</div>
		</div>
		{#each kanakaIntakeList as ki}
			<div class="row">
				<div>{ki.intake_id}</div>
				<div>{ki.given_name}</div>
				<div>{ki.family_name}</div>
				<div>{ki.birth_date}</div>
				<div>{ki.birth_place}</div>
				<div>{ki.mom_given_name}</div>
				<div>{ki.mom_family_name}</div>
				<div>{ki.mom_birth_date}</div>
				<div>{ki.mom_birth_place}</div>
				<div>{ki.dad_given_name}</div>
				<div>{ki.dad_family_name}</div>
				<div>{ki.dad_birth_date}</div>
				<div>{ki.dad_birth_place}</div>
				<div>{ki.load_status}</div>
			</div>
		{/each}
	</div>
{:else}
	<div>-</div>
{/if}

<style>
	.wrapper .row {
		display: grid;
		grid-template-columns: repeat(14, 1fr);
	}
	.wrapper .hdr {
		font-weight: bold;
	}
</style>