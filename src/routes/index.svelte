<script lang="ts">
	import { isSignedIn, signUp, signIn, user } from '$lib/nhost';
	import { createKanakaIntake } from '$lib/graphql-access';	
    import Button from "@smui/button";
    import Card from "@smui/card";
    import PrimaryAction from "@smui/card";

	let step = 'add_person';
	let message = ''; // warning messages
    let personalData = {};
    let familyData = {};

	async function loginFormSubmit(e) {
		console.log("Signing in...");
		const formData = new FormData(e.target);
		const submitData = {};
		for (let field of formData) {
			const [key, value] = field;
			submitData[key] = value;
		}
		console.log("submitData: ", submitData);

		if (e.submitter.id === 'login') {
			const data = await signIn(submitData);
			console.log(data);
			if(data.error) {
				message = data.error.message;
			}
			else {
				message = "";
				step = "add_person";
			}
		} else {
			const data = await signUp(submitData);
			console.log(data);
			if(data.error) {
				message = data.error.message;
			}
			else {
				message = "";
				step = "add_person";
			}
		}

	}

	function addPerson() {
		console.log("Adding person...");
		step = "step_one";
	}

	function stepOne(e) {
		console.log("Step one...");
		step = "step_two";
		const formData = new FormData(e.target);
		const submitData = {};
		for (let field of formData) {
			const [key, value] = field;
			submitData[key] = value;
		}
		console.log('submitData: ', submitData);
        personalData = submitData;
	}

	function stepTwo(e) {
		step = "step_three";
        const formData = new FormData(e.target);
		const submitData = {};
		for (let field of formData) {
			const [key, value] = field;
			submitData[key] = value;
		}
		console.log('submitData: ', submitData);
        familyData = submitData;
	}

    function cancel() {
		console.log("Canceling...");
		step = "add_person";
	}
	
	async function requestFormSubmit(e) {
		step = "add_person";
		console.log('requestFormSubmit()');
        const formData = new FormData(e.target);
		const submitData = {};
		for (let field of formData) {
			const [key, value] = field;
			submitData[key] = value;
		}
        let combined = Object.assign(submitData, personalData, familyData);
		console.log('combined: ', combined);
		try {
			// insert kanakaintake record 
			let rv = await createKanakaIntake(combined, 'public', '');
			console.log("rv: ", rv);
			alert("Data added, pending review of team.");
		} catch (error) {
			console.log('error: ', error);
			message = message + '; ' + error?.message;
		}
	}

</script>


{#if $isSignedIn === false || $user === null}

	<div id="welcome">
		<h3 class="e_komo_mai">E Komo Mai</h3>

        <form on:submit|preventDefault={loginFormSubmit}>
		<div class="form-item-wrapper">
			<input name="email" type="text" placeholder="Email" id="email" class="form-field" />
		</div>
		<div class="form-item-wrapper">
			<input name="password" type="password" placeholder="Password" id="password" class="form-field" />
		</div>
		<Button class="login-btn" id="login">Login</Button>
		<Button class="login-btn" id="signup">Signup</Button>
		</form>
	</div>
{:else if step === 'add_person'}
	<div id="add_person">
		<h3>Hello {$user.displayName}</h3>

        <div class="card-display">
            <div class="card-container">
              <Card>
                <PrimaryAction on:click={addPerson} padded>
                  + Add Person
                </PrimaryAction>
              </Card>
            </div>
        </div>
	</div>
{:else if step === 'step_one'}
	<div id="step_one">
		<h3>Step 1: Basic Info</h3>
		<span class="step-on">Step 1: Basic Info</span> -> <span class="step-off">Step 2: Relationship</span> -> <span class="step-off">Step 3: Upload Docs</span>
		<br />
        <form on:submit|preventDefault={stepOne}>
            <div class="form-item-wrapper">
                <input id="family_name" name="family_name" type="text" placeholder="Family Name" class="form-field" /><br />
                <input id="given_name" name="given_name" type="text" placeholder="Given Name" class="form-field" /><br />
                <input id="birth_place" name="birth_place" type="text" placeholder="Birthplace" class="form-field" /><br />
				<label for="birth_date">Birthdate</label><br />
                <input id="birth_date" name="birth_date" type="date" placeholder="Birthdate" class="form-field" /><br />
            </div>
            <Button on:click={cancel} color="secondary">Cancel</Button>
            <Button>Next</Button>
        </form>

	</div>
{:else if step === 'step_two'}

	<!-- TODO: add edit/pre-populate -->
	<div id="step_two">
		<h2>Step 2: Relationship</h2>
		<span class="step-off">Step 1: Basic Info</span> -> <span class="step-on">Step 2: Relationship</span> -> <span class="step-off">Step 3: Upload Docs</span>
		<br />
        <h3>Mother</h3>
        <form on:submit|preventDefault={stepTwo}>
            <div class="form-item-wrapper">
                <input id="mom_family_name" name="mom_family_name" type="text" placeholder="Mothers Family Name" class="form-field" /><br />
                <input id="mom_given_name" name="mom_given_name" type="text" placeholder="Mothers Given Name" class="form-field" /><br />
                <input id="mom_birth_place" name="mom_birth_place" type="text" placeholder="Mothers Birthplace" class="form-field" /><br />
				<label for="mom_birth_date">Birthdate</label><br />
                <input id="mom_birth_date" name="mom_birth_date" type="date" placeholder="Mothers Birthdate" class="form-field" /><br />
            </div>
            <h3>Father</h3>
            <div class="form-item-wrapper">
                <input id="dad_family_name" name="dad_family_name" type="text" placeholder="Fathers Family Name" class="form-field" /><br />
                <input id="dad_given_name" name="dad_given_name" type="text" placeholder="Fathers Given Name" class="form-field" /><br />
                <input id="dad_birth_place" name="dad_birth_place" type="text" placeholder="Fathers Birthdate" class="form-field" /><br />
				<label for="dad_birth_date">Birthdate</label><br />
                <input id="dad_birth_date" name="dad_birth_date" type="date" placeholder="Fathers Birthdate" class="form-field" /><br />
            </div>
          <Button on:click={cancel} color="secondary">Cancel</Button>
          <Button>Next</Button>
        </form>
	</div>

{:else if step === 'step_three'}
	<div id="step_three">
		<h3>Step 3: Upload Docs</h3>		
		<span class="step-off">Step 1: Basic Info</span> -> <span class="step-off">Step 2: Relationship</span> -> <span class="step-on">Step 3: Upload Docs</span>
		<br />
        <form on:submit|preventDefault={requestFormSubmit}>
			<input type="file" id="file_id" name="filename">
            <Button on:click={cancel} color="secondary">Cancel</Button>
            <Button>Finish</Button>	
    	</form>
	</div>
{/if}


<div style="color:red" id="warn_msg">{message}</div>